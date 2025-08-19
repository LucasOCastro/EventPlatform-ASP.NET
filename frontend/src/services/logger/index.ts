import type { ILogger } from "@/services/logger/ILogger.ts";
import { ConsoleLoggerService } from "@/services/logger/ConsoleLoggerService.ts";

export const logger: ILogger = new ConsoleLoggerService();
