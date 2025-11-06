import type { ILogger, LogLevel } from "@/services/logger/ILogger.ts";
import { type Mock, vi } from "vitest";

export class LoggerMock implements ILogger {
  log: Mock<(logLevel: LogLevel, ...data: unknown[]) => void> = vi.fn();
  debug: Mock<(...data: unknown[]) => void> = vi.fn();
  error: Mock<(...data: unknown[]) => void> = vi.fn();
  info: Mock<(...data: unknown[]) => void> = vi.fn();
  warn: Mock<(...data: unknown[]) => void> = vi.fn();
}
