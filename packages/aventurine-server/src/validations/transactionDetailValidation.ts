import { z } from "zod";

export const createTransactionDetailSchema = z.object({
  transaction_header_pk: z.number(),
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});
