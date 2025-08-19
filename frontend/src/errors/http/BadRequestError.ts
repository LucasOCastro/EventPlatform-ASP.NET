import { HttpError } from "@/errors";

export class BadRequestError extends HttpError {
  public static statusCode = 400;

  constructor(message?: string) {
    super(BadRequestError.statusCode, message);
  }
}
