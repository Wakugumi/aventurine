import { PrismaClient } from "@prisma/client";
import { categoryRepository } from "../categoryRepository";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.category.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Category Repository", () => {
  it("creates a category", async () => {
    const data = { title: "Test Category" };
    const category = await categoryRepository.create(data);
    expect(category).toHaveProperty("id");
    expect(category.title).toBe(data.title);
  });

  it("fetches all categories", async () => {
    await categoryRepository.create({ title: "C1" });
    await categoryRepository.create({ title: "C2" });
    const categories = await categoryRepository.findAll();
    expect(categories.length).toBe(2);
  });

  it("fetches by id", async () => {
    const c = await categoryRepository.create({ title: "One" });
    const found = await categoryRepository.findById(c.id);
    expect(found?.title).toBe("One");
  });

  it("updates a category", async () => {
    const c = await categoryRepository.create({ title: "Old" });
    const updated = await categoryRepository.update(c.id, { title: "New" });
    expect(updated.title).toBe("New");
  });

  it("deletes a category", async () => {
    const c = await categoryRepository.create({ title: "Temp" });
    await categoryRepository.delete(c.id);
    const shouldBeNull = await categoryRepository.findById(c.id);
    expect(shouldBeNull).toBeNull();
  });
});
