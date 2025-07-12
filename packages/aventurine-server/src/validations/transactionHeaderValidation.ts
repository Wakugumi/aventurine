import { z } from "zod";

export const createTransactionHeaderSchema = z.object({
  id: z.string().uuid(),
  subtotal: z.number().min(0),
});
