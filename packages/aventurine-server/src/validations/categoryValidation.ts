import { z } from "zod";

export const createCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});
