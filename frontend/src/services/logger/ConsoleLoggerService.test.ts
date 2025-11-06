import { type MockInstance, vi } from "vitest";
import { ConsoleLoggerService } from "./ConsoleLoggerService.ts";
import {
  LogLevels,
  type ILogger,
  type LogLevel,
} from "@/services/logger/ILogger.ts";

const LOG_DATA = [
  "test",
  1,
  3,
  "append " + 5.63,
  Date.now(),
  { test: "data", inner: { foo: "bar", a: 3 } },
  [1, 3, "asd"],
  null,
];

describe("ConsoleLoggerService", () => {
  let logger: ILogger;
  const methodKeys = LogLevels.map((level) =>
    level.toLowerCase(),
  ) as LogLevel[];
  let consoleSpy: Record<LogLevel, MockInstance<Console[LogLevel]>>;

  beforeEach(() => {
    logger = new ConsoleLoggerService();

    const entries = methodKeys.map((key) => [
      key,
      vi.spyOn(console, key).mockImplementation(() => {}),
    ]);
    consoleSpy = Object.fromEntries(entries);
  });

  methodKeys.forEach((key) => {
    describe(key, () => {
      const prefix = `[${key.toUpperCase()}]`;
      it("should call the console method in the log method", async () => {
        logger.log(key, ...LOG_DATA);
        expect(consoleSpy[key]).toHaveBeenCalledWith(prefix, ...LOG_DATA);
      });
      it("should call the console method in the specific method", async () => {
        logger[key](...LOG_DATA);
        expect(consoleSpy[key]).toHaveBeenCalledWith(prefix, ...LOG_DATA);
      });
    });
  });
});
