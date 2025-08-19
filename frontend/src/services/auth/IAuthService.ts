import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import type { UserProfile } from "@/schemes/user.schema.ts";

export interface IAuthService {
  login(data: LoginType): Promise<UserProfile>;
  register(data: RegisterType): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): UserProfile | null;
}
