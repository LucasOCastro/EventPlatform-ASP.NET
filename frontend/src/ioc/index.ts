import type {
  IIocRegistry,
  IocFactories,
} from "@/ioc/registry/ioc-registry.ts";
import { IocRegistryImpl } from "@/ioc/registry/ioc-registry-impl.ts";
import { ConsoleLoggerService } from "@/services/logger/ConsoleLoggerService.ts";
import { FetchRequestService } from "@/services/request/FetchRequestService.ts";
import { AuthService } from "@/services/auth/AuthService.ts";
import type { ILogger } from "@/services/logger/ILogger.ts";
import type { IRequestService } from "@/services/request/IRequestService.ts";
import type { IAuthService } from "@/services/auth/IAuthService.ts";

type Config = {
  ILogger: ILogger;
  IRequestService: IRequestService;
  IAuthService: IAuthService;
};

const factories: IocFactories<Config> = {
  ILogger: () => new ConsoleLoggerService(),
  IRequestService: (registry) =>
    new FetchRequestService(registry.get("ILogger")),
  IAuthService: (registry) =>
    new AuthService(registry.get("IRequestService"), registry.get("ILogger")),
};

export const registry: IIocRegistry<Config> = new IocRegistryImpl<Config>(
  factories,
);
