export type RequestVerb = "GET" | "POST" | "PUT" | "DELETE";

export interface BaseRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface BodyRequestOptions extends BaseRequestOptions {
  body?: string | object;
}

export type GetRequestOptions = BaseRequestOptions;
export type PostRequestOptions = BodyRequestOptions;
export type PutRequestOptions = BodyRequestOptions;
export type DeleteRequestOptions = BaseRequestOptions;

export type RequestOptionDictionary = {
  GET: GetRequestOptions;
  POST: PostRequestOptions;
  PUT: PutRequestOptions;
  DELETE: DeleteRequestOptions;
};

export interface IRequestService {
  get<T>(url: string, options?: GetRequestOptions): Promise<T>;
  post<T>(url: string, options?: PostRequestOptions): Promise<T>;
  put<T>(url: string, options?: PutRequestOptions): Promise<T>;
  delete<T>(url: string, options?: DeleteRequestOptions): Promise<T>;
}
