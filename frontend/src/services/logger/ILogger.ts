export const LogLevels = ["info", "warn", "error", "debug"] as const;

export type LogLevel = (typeof LogLevels)[number];

type DataType = unknown;

export interface ILogger {
  log(level: LogLevel, ...data: DataType[]): void;
  info(...data: DataType[]): void;
  warn(...data: DataType[]): void;
  error(...data: DataType[]): void;
  debug(...data: DataType[]): void;
}
