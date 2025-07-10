import { createCategorySchema } from "../categoryValidation";

describe("Category Validation", () => {
  it("accepts valid minimal data", () => {
    const result = createCategorySchema.safeParse({
      title: "Electronics",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = createCategorySchema.safeParse({
      title: "Electronics",
      description: "Electronic devices and accessories",
      image: "electronics.png",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createCategorySchema.safeParse({
      description: "Some description",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("rejects empty title", () => {
    const result = createCategorySchema.safeParse({
      title: "",
      description: "Some description",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("accepts optional description being omitted", () => {
    const result = createCategorySchema.safeParse({
      title: "Books",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional image being omitted", () => {
    const result = createCategorySchema.safeParse({
      title: "Sports",
      description: "Sports equipment",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-string title", () => {
    const result = createCategorySchema.safeParse({
      title: 123,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("rejects non-string description when provided", () => {
    const result = createCategorySchema.safeParse({
      title: "Food",
      description: 123,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("description");
    }
  });

  it("rejects non-string image when provided", () => {
    const result = createCategorySchema.safeParse({
      title: "Clothing",
      image: 123,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("image");
    }
  });

  it("rejects null optional fields", () => {
    const result = createCategorySchema.safeParse({
      title: "Furniture",
      description: null,
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional fields", () => {
    const result = createCategorySchema.safeParse({
      title: "Home",
      description: "",
      image: "",
    });
    expect(result.success).toBe(true);
  });
});
