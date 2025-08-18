import { HttpError } from "./HttpError.ts";

export class UnauthorizedError extends HttpError {
  public static statusCode = 401;

  constructor(message: string) {
    super(UnauthorizedError.statusCode, message);
  }
}
