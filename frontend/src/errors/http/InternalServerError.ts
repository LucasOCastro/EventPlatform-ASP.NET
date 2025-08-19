import { HttpError } from "@/errors";

export class InternalServerError extends HttpError {
  public static statusCode = 500;

  constructor(message?: string) {
    super(InternalServerError.statusCode, message);
  }
}
