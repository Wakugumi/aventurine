import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'The status of an order',
});
