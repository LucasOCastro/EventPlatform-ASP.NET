import type { IAuthService } from "@/services/auth/IAuthService.ts";
import { AuthService } from "./AuthService";
import { requestService } from "@/services/request";
import { logger } from "@/services/logger";

export const authService: IAuthService = new AuthService(
  requestService,
  logger,
);
