import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});
export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    firstName: z.string().min(2).max(40),
    lastName: z.string().min(2).max(40),
    birthDate: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterType = z.infer<typeof registerSchema>;
