import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  profilePictureUrl: z.url().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
