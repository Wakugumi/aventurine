import { createProductSchema } from "../productValidation";

describe("Product Validation", () => {
  it("accepts valid minimal data", () => {
    const result = createProductSchema.safeParse({
      title: "Apple",
      price: 100,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = createProductSchema.safeParse({
      category_id: 1,
      title: "Banana",
      description: "Fresh banana",
      image: "banana.png",
      price: 20,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createProductSchema.safeParse({
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("rejects empty title", () => {
    const result = createProductSchema.safeParse({
      title: "",
      price: 50,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createProductSchema.safeParse({
      title: "Orange",
      price: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("price");
    }
  });

  it("rejects non-number category_id", () => {
    const result = createProductSchema.safeParse({
      category_id: "wrong", // invalid type
      title: "Apple",
      price: 10,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields being omitted", () => {
    const result = createProductSchema.safeParse({
      title: "Kiwi",
      price: 15,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional fields being set to null (Zod will fail on null)", () => {
    const result = createProductSchema.safeParse({
      title: "Mango",
      price: 20,
      description: null, // Edge case: Null is NOT same as undefined here.
    });
    expect(result.success).toBe(false);
  });
});
