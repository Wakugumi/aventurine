import { createProfileSchema } from "../profileValidation";

describe("Profile Validation", () => {
  it("accepts valid profile data", () => {
    const result = createProfileSchema.safeParse({
      name: "John Doe",
      currency: "USD",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createProfileSchema.safeParse({
      currency: "USD",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects empty name", () => {
    const result = createProfileSchema.safeParse({
      name: "",
      currency: "USD",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects missing currency", () => {
    const result = createProfileSchema.safeParse({
      name: "John Doe",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("currency");
    }
  });

  it("rejects empty currency", () => {
    const result = createProfileSchema.safeParse({
      name: "John Doe",
      currency: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("currency");
    }
  });

  it("rejects non-string name", () => {
    const result = createProfileSchema.safeParse({
      name: 123,
      currency: "USD",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects non-string currency", () => {
    const result = createProfileSchema.safeParse({
      name: "John Doe",
      currency: 123,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("currency");
    }
  });

  it("accepts various currency formats", () => {
    const currencies = ["USD", "EUR", "GBP", "JPY", "IDR"];
    currencies.forEach(currency => {
      const result = createProfileSchema.safeParse({
        name: "Test User",
        currency: currency,
      });
      expect(result.success).toBe(true);
    });
  });
});
