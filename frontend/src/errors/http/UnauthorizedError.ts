// noinspection ES6PreferShortImport
import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  public static statusCode = 401;

  constructor(message?: string) {
    super(UnauthorizedError.statusCode, message);
  }
}
