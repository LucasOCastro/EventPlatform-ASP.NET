import { z } from "zod";
import dayjs from "dayjs";

export const MIN_PASSWORD_LENGTH = 6 as const;
export const MIN_AGE = 14 as const;
export const MAX_BIRTH_DATE = dayjs()
  .utc()
  .subtract(MIN_AGE, "years")
  .startOf("day")
  .toDate();

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});
export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirmPassword: z.string(),
    firstName: z.string().min(2).max(40),
    lastName: z.string().min(2).max(40),
    birthDate: z.coerce.date().max(MAX_BIRTH_DATE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterType = z.infer<typeof registerSchema>;
