import { PrismaClient } from "@prisma/client";
import { productRepository } from "../productRepository";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.product.deleteMany(); // Clear before each test
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Product Repository", () => {
  it("creates a product", async () => {
    const data = {
      title: "Test Product",
      price: 100,
    };
    const product = await productRepository.create(data);
    expect(product).toHaveProperty("id");
    expect(product.title).toBe(data.title);
  });

  it("fetches all products", async () => {
    await productRepository.create({ title: "P1", price: 10 });
    await productRepository.create({ title: "P2", price: 20 });
    const products = await productRepository.findAll();
    expect(products.length).toBe(2);
  });

  it("fetches by id", async () => {
    const p = await productRepository.create({ title: "One", price: 10 });
    const found = await productRepository.findById(p.id);
    expect(found?.title).toBe("One");
  });

  it("updates a product", async () => {
    const p = await productRepository.create({ title: "Old", price: 5 });
    const updated = await productRepository.update(p.id, { title: "New" });
    expect(updated.title).toBe("New");
  });

  it("deletes a product", async () => {
    const p = await productRepository.create({ title: "Temp", price: 1 });
    await productRepository.delete(p.id);
    const shouldBeNull = await productRepository.findById(p.id);
    expect(shouldBeNull).toBeNull();
  });
});
