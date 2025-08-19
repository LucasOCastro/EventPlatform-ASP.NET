import { loginSchema, registerSchema } from "@/schemes/auth.schema.ts";
import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import { userProfileSchema, type UserProfile } from "@/schemes/user.schema.ts";
import type { IAuthService } from "@/services/auth/IAuthService.ts";
import type { ILogger } from "@/services/logger/ILogger.ts";
import type { IRequestService } from "@/services/request/IRequestService.ts";

export class AuthService implements IAuthService {
  private readonly _requestService: IRequestService;
  private readonly _logger: ILogger;
  private _user: UserProfile | null = null;

  constructor(requestService: IRequestService, logger: ILogger) {
    this._requestService = requestService;
    this._logger = logger;
  }

  getCurrentUser(): UserProfile | null {
    return this._user;
  }

  async login(data: LoginType): Promise<UserProfile> {
    try {
      data = loginSchema.parse(data);

      const result = await this._requestService.post("/login", { body: data });

      const user = userProfileSchema.parse(result);
      this._user = user;

      return user;
    } catch (err) {
      this._logger.error("[AuthService.login]", err);
      throw err;
    }
  }

  async register(data: RegisterType): Promise<UserProfile> {
    try {
      data = registerSchema.parse(data);

      await this._requestService.post("/register", { body: data });

      return await this.login(data);
    } catch (err) {
      this._logger.error("[AuthService.register]", err);
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await this._requestService.post("/logout");
      this._user = null;
    } catch (err) {
      this._logger.error("[AuthService.logout]", err);
      throw err;
    }
  }
}
