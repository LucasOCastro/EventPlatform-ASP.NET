export class HttpError extends Error {
  //TODO include retryable?

  public static statusCode?: number;
  public statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message || `HTTP Error ${statusCode}`);
    this.statusCode = statusCode;
    this.name = new.target.name;
  }
}

export type HttpErrorClass = {
  new (message?: string): HttpError;
  statusCode?: number;
};
