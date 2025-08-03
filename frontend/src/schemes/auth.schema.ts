import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
});

export type RegisterType = z.infer<typeof registerSchema>;
