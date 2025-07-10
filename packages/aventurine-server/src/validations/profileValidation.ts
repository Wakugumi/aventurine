import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(1),
  currency: z.string().min(1),
});
