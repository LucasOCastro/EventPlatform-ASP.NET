import { ConnectionError } from "@/errors/ConnectionError.ts";

export class TimeoutError extends ConnectionError {
  constructor(message = "Request timed out", cause?: unknown) {
    super(message, cause);
  }
}