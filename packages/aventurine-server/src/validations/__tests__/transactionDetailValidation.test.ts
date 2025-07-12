import { createTransactionDetailSchema } from "../transactionDetailValidation";

describe("Transaction Detail Validation", () => {
  it("accepts valid transaction detail data", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 2,
      price: 50.75,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing transaction_header_pk", () => {
    const result = createTransactionDetailSchema.safeParse({
      product_id: 10,
      quantity: 2,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("transaction_header_pk");
    }
  });

  it("rejects missing product_id", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      quantity: 2,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("product_id");
    }
  });

  it("rejects missing quantity", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("quantity");
    }
  });

  it("rejects missing price", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 2,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("price");
    }
  });

  it("rejects zero quantity", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 0,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("quantity");
    }
  });

  it("rejects negative quantity", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: -1,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("quantity");
    }
  });

  it("rejects negative price", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 2,
      price: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("price");
    }
  });

  it("accepts zero price", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 1,
      price: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts decimal price", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 3,
      price: 12.99,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-number transaction_header_pk", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: "invalid",
      product_id: 10,
      quantity: 2,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("transaction_header_pk");
    }
  });

  it("rejects non-number product_id", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: "invalid",
      quantity: 2,
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("product_id");
    }
  });

  it("rejects non-number quantity", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: "invalid",
      price: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("quantity");
    }
  });

  it("rejects non-number price", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 2,
      price: "invalid",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("price");
    }
  });

  it("accepts large quantity values", () => {
    const result = createTransactionDetailSchema.safeParse({
      transaction_header_pk: 1,
      product_id: 10,
      quantity: 1000,
      price: 1.50,
    });
    expect(result.success).toBe(true);
  });
});
