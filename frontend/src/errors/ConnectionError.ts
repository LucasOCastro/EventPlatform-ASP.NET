export class ConnectionError extends Error {
  constructor(message = "Connection error", cause?: unknown) {
    super(message, { cause });
    this.name = new.target.name;
  }
}
