import { z } from "zod";

// Profile Schema
export const profileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  currency: z.string(),
});

// Category Schema
export const categorySchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  created_at: z.string(),
});

// Product Schema
export const productSchema = z.object({
  id: z.number().int(),
  category_id: z.number().int().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  price: z.number().int(),
  created_at: z.string(),
});

// Transaction Header Schema
export const transactionHeaderSchema = z.object({
  pk: z.number().int(),
  id: z.string(), // UUID as string
  timestamp: z.string(),
  subtotal: z.number(),
});

// Transaction Detail Schema
export const transactionDetailSchema = z.object({
  id: z.number().int(),
  transaction_id: z.number().int(),
  product_id: z.number().int(),
  quantity: z.number().int(),
  total: z.number(),
});
