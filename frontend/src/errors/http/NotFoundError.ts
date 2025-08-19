import { HttpError } from "@/errors";

export class NotFoundError extends HttpError {
  public static statusCode = 404;

  constructor(message?: string) {
    super(NotFoundError.statusCode, message);
  }
}
