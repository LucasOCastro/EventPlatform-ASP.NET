import {
  type DeleteRequestOptions,
  type GetRequestOptions,
  type IRequestService,
  type PostRequestOptions,
  type PutRequestOptions,
} from "./IRequestService.ts";
import { ConnectionError, TimeoutError, makeHttpError } from "@/errors";
import type { ILogger } from "@/services/logger/ILogger.ts";

const DEFAULT_TIMEOUT = 5 * 1000;

interface ErrorResponse {
  message: string;
  // TODO handle multiple errors - toast?
  // errors: string[];
}

export class FetchRequestService implements IRequestService {
  private _logger: ILogger;
  constructor(logger: ILogger) {
    this._logger = logger;
  }

  async get<T>(url: string, options?: GetRequestOptions): Promise<T> {
    const { headers = {}, timeout } = options || {};
    return this._request(
      url,
      {
        method: "GET",
        headers: {
          ...headers,
        },
      },
      timeout,
    );
  }

  async post<T>(url: string, options?: PostRequestOptions): Promise<T> {
    const { headers = {}, body, timeout } = options || {};
    return this._request(
      url,
      {
        method: "POST",
        headers: {
          ...(body && { "Content-Type": "application/json" }),
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      },
      timeout,
    );
  }

  put<T>(url: string, options?: PutRequestOptions): Promise<T> {
    const { headers = {}, body, timeout } = options || {};
    return this._request(
      url,
      {
        method: "PUT",
        headers: {
          ...(body && { "Content-Type": "application/json" }),
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      },
      timeout,
    );
  }

  delete<T>(url: string, options?: DeleteRequestOptions): Promise<T> {
    const { headers = {}, timeout } = options || {};
    return this._request(
      url,
      {
        method: "DELETE",
        headers: {
          ...headers,
        },
      },
      timeout,
    );
  }

  private async _request(
    url: string,
    options: RequestInit,
    timeout = DEFAULT_TIMEOUT,
  ) {
    if (timeout > 0) {
      options.signal = AbortSignal.timeout(timeout);
    }

    let res: Response;
    try {
      res = await fetch(url, options);
    } catch (err) {
      const isAbort =
        err && typeof err === "object" && (err as Error).name === "AbortError";

      this._logger.error(`Fetch error for ${url}:`, err);
      throw isAbort
        ? new TimeoutError("Request timed out: " + url, err)
        : new ConnectionError("Network error while fetching: " + url, err);
    }

    if (!res.ok) {
      this._logger.error(`Request failed for ${url}:`, res);
      throw await this._makeHttpError(res);
    }

    if (!this._returnsData(res)) return null;

    try {
      return res.json();
    } catch (err) {
      this._logger.error(`Invalid JSON response from ${url}:`, err);
      throw new Error(
        `Invalid JSON response (status ${res.status}) from ${url}`,
      );
    }
  }

  private async _extractErrorMessages(res: Response) {
    try {
      const data = (await res.json()) as Partial<ErrorResponse>;
      if (data.message) return data.message;
    } catch {
      /* No custom message */
    }

    return res.statusText;
  }

  private async _makeHttpError(res: Response) {
    const status = res.status;
    const message = await this._extractErrorMessages(res);
    return makeHttpError(status, message);
  }

  private _returnsData(res: Response) {
    return res.status !== 204;
  }
}
