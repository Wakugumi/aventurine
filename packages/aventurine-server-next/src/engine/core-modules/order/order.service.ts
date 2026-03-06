import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderInput } from './dtos/create-order.input';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order, 'core')
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem, 'core')
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepository.create({
      notes: input.notes,
      storeId: input.storeId,
      userStoreId: input.userStoreId,
      status: OrderStatus.PENDING,
      totalAmount,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = input.items.map((item) =>
      this.orderItemRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    const createdOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });

    if (!createdOrder) {
      throw new NotFoundException(`Order with id ${savedOrder.id} not found`);
    }

    return createdOrder;
  }

  async findOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async findOrdersByStoreId(storeId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { storeId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOrderById(id);

    order.status = status;

    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }
}
