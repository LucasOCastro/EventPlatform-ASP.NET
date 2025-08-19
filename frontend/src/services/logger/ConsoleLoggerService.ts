import type { ILogger, LogLevel } from "@/services/logger/ILogger.ts";

export class ConsoleLoggerService implements ILogger {
  log(level: LogLevel, ...data: unknown[]): void {
    console[level](this._getPrefix(level), ...data.map(this._stringify));
  }

  info(...data: unknown[]): void {
    this.log("info", ...data);
  }

  warn(...data: unknown[]): void {
    this.log("warn", ...data);
  }
  error(...data: unknown[]): void {
    this.log("error", ...data);
  }
  debug(...data: unknown[]): void {
    this.log("debug", ...data);
  }

  private _getPrefix(level: LogLevel): string {
    return `[${level.toUpperCase()}]`;
  }

  private _stringify(data: unknown): string {
    return typeof data === "string" ? data : JSON.stringify(data);
  }
}
