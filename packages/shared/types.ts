import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Profile = z.infer<typeof profileSchema>;