import { createTransactionHeaderSchema } from "../transactionHeaderValidation";

describe("Transaction Header Validation", () => {
  it("accepts valid transaction header data", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      subtotal: 100.50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = createTransactionHeaderSchema.safeParse({
      subtotal: 100,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("id");
    }
  });

  it("rejects invalid UUID format", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "invalid-uuid",
      subtotal: 100,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("id");
    }
  });

  it("rejects empty string id", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "",
      subtotal: 100,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("id");
    }
  });

  it("rejects missing subtotal", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("subtotal");
    }
  });

  it("rejects negative subtotal", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      subtotal: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("subtotal");
    }
  });

  it("accepts zero subtotal", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      subtotal: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts decimal subtotal", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      subtotal: 123.45,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-number subtotal", () => {
    const result = createTransactionHeaderSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      subtotal: "100",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("subtotal");
    }
  });

  it("accepts various valid UUID formats", () => {
    const validUUIDs = [
      "550e8400-e29b-41d4-a716-446655440000",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    ];
    
    validUUIDs.forEach(uuid => {
      const result = createTransactionHeaderSchema.safeParse({
        id: uuid,
        subtotal: 100,
      });
      expect(result.success).toBe(true);
    });
  });
});
