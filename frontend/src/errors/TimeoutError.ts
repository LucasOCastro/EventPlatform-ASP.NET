// noinspection ES6PreferShortImport
import { ConnectionError } from "./ConnectionError";

export class TimeoutError extends ConnectionError {
  constructor(message = "Request timed out", cause?: unknown) {
    super(message, cause);
  }
}
