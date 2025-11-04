import type { ILogger } from "@/services/logger/ILogger.ts";
import { vi } from "vitest";

export class LoggerMock implements ILogger {
  debug = vi.fn();
  error = vi.fn();
  info = vi.fn();
  log = vi.fn();
  warn = vi.fn();
}
