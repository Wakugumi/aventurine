import { PrismaClient } from "@prisma/client";
import { transactionHeaderRepository } from "../transactionHeaderRepository";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const data = () => {
  return {
    id: randomUUID(),
    subtotal: 100,
  };
};

beforeEach(async () => {
  await prisma.transactionHeader.deleteMany();
});

afterAll(async () => {
  await prisma.transactionHeader.deleteMany();
  await prisma.$disconnect();
});

describe("Transaction Header Repository", () => {
  it("creates a transaction header", async () => {
    const header = await transactionHeaderRepository.create(data());
    expect(header).toHaveProperty("pk");
  });

  it("fetches all transaction headers", async () => {
    await transactionHeaderRepository.create(data());
    await transactionHeaderRepository.create(data());
    const headers = await transactionHeaderRepository.findAll();
    expect(headers.length).toBe(2);
  });

  it("fetches by pk", async () => {
    const h = await transactionHeaderRepository.create(data());
    const found = await transactionHeaderRepository.findById(h.pk);
    expect(found?.pk).toBe(h.pk);
  });

  it("updates a transaction header", async () => {
    const h = await transactionHeaderRepository.create(data());
    const updated = await transactionHeaderRepository.update(h.pk, data());
    expect(updated.pk).toBe(h.pk);
  });

  it("deletes a transaction header", async () => {
    const h = await transactionHeaderRepository.create(data());
    await transactionHeaderRepository.delete(h.pk);
    const shouldBeNull = await transactionHeaderRepository.findById(h.pk);
    expect(shouldBeNull).toBeNull();
  });
});
