import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.int().nonnegative(),
  email: z.email(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  profilePictureUrl: z.url().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
