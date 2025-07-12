import { PrismaClient } from "@prisma/client";
import { transactionDetailRepository } from "../transactionDetailRepository";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const transaction_head = {
  pk: 2,
  id: randomUUID().toString(),
};
const product = {
  id: 1,
  title: "Product",
  description: "description",
};

const data = {
  transaction_header_pk: transaction_head.pk,
  product_id: product.id,
  quantity: 1,
  total: 10,
};

beforeAll(async () => {
  await prisma.product.create({ data: product });
  await prisma.transactionHeader.create({ data: transaction_head });
});

beforeEach(async () => {
  await prisma.transactionDetail.deleteMany();
});

afterAll(async () => {
  await prisma.transactionHeader.deleteMany();
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});

describe("Transaction Detail Repository", () => {
  it("creates a transaction detail", async () => {
    const detail = await transactionDetailRepository.create(data);
    expect(detail).toHaveProperty("id");
  });

  it("fetches all transaction details", async () => {
    await transactionDetailRepository.create(data);
    await transactionDetailRepository.create(data);
    const details = await transactionDetailRepository.findAll();
    expect(details.length).toBe(2);
  });

  it("fetches by id", async () => {
    const d = await transactionDetailRepository.create(data);
    const found = await transactionDetailRepository.findById(d.id);
    expect(found?.id).toBe(d.id);
  });

  it("updates a transaction detail", async () => {
    const d = await transactionDetailRepository.create(data);
    const updated = await transactionDetailRepository.update(d.id, {});
    expect(updated.id).toBe(d.id);
  });

  it("deletes a transaction detail", async () => {
    const d = await transactionDetailRepository.create(data);
    await transactionDetailRepository.delete(d.id);
    const shouldBeNull = await transactionDetailRepository.findById(d.id);
    expect(shouldBeNull).toBeNull();
  });
});
