import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().min(0),
});
