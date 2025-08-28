import { HttpError, type HttpErrorClass } from "./HttpError";

const modules = import.meta.glob("./*.ts", { eager: true });

const classes = Object.values(modules)
  .flatMap((m: unknown) => Object.values(m as object))
  .filter(
    (v): v is HttpErrorClass =>
      typeof v === "function" && (v as HttpErrorClass).statusCode !== undefined,
  );

export const NetworkErrors: Record<number, HttpErrorClass> = Object.fromEntries(
  classes.map((c) => [c.statusCode!, c]),
);

export function makeHttpError(status: number, message?: string) {
  const Ctor = NetworkErrors[status];
  return Ctor
    ? new Ctor(message)
    : new HttpError(status, message ?? `HTTP ${status}`);
}

export * from "./HttpError";
