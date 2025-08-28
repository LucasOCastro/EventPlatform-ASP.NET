// noinspection ES6PreferShortImport
import { HttpError } from "./HttpError";

export class ConflictError extends HttpError {
  public static statusCode = 409;

  constructor(message?: string) {
    super(ConflictError.statusCode, message);
  }
}
