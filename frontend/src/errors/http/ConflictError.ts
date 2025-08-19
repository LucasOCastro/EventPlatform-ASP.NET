import { HttpError } from "@/errors";

export class ConflictError extends HttpError {
  public static statusCode = 409;

  constructor(message?: string) {
    super(ConflictError.statusCode, message);
  }
}
