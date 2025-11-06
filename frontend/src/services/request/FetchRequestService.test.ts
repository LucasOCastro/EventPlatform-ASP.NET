import { DEFAULT_TIMEOUT, FetchRequestService } from "./FetchRequestService.ts";
import type {
  IRequestService,
  RequestOptionDictionary,
  RequestVerb,
} from "@/services/request/IRequestService.ts";
import { NetworkErrors } from "@/errors/http";
import { ConnectionError, TimeoutError } from "@/errors";
import { LoggerMock } from "@/tests/mocks/services/Logger.mock.ts";
import { vi } from "vitest";

const URL = "/test/url";
const BODY = { test: "data" };
const TIMEOUT = 10;
const ERROR_MESSAGE = "test error";

interface VerbTest<Verb extends RequestVerb> {
  verb: Verb;
  options: RequestOptionDictionary[Verb];
  happyStatus: number;
  expectedCallParam?: object;
}

describe("FetchRequestService", () => {
  const loggerMock = new LoggerMock();
  let requestService: IRequestService;
  beforeEach(() => {
    requestService = new FetchRequestService(loggerMock);
    vi.resetAllMocks();
    fetchMock.resetMocks();
  });

  function testVerb<Verb extends RequestVerb>(params: VerbTest<Verb>) {
    const { verb, options, happyStatus, expectedCallParam } = params;
    const fn = (url: string, options?: RequestOptionDictionary[Verb]) =>
      requestService[verb.toLowerCase() as keyof IRequestService](url, options);

    const returnsData = happyStatus !== 204;

    describe(`${verb}`, () => {
      it("should handle a successful request", async () => {
        const mockData = returnsData ? { id: 1, name: "test item" } : null;
        const response = returnsData ? JSON.stringify(mockData) : undefined;
        fetchMock.mockResponseOnce(response, { status: happyStatus });

        const result = await fn(URL, options);

        expect(fetchMock).toHaveBeenCalledWith(
          URL,
          expect.objectContaining({
            method: verb,
            headers: {},
            ...expectedCallParam,
          }),
        );

        expect(result).toEqual(mockData);
      });

      describe("timeout", () => {
        beforeEach(() => {
          vi.useFakeTimers();
        });

        afterEach(() => {
          vi.useRealTimers();
        });

        function mockDelayedResponse(delay: number) {
          const mockData = returnsData ? { id: 1, name: "test item" } : null;
          const response = returnsData ? JSON.stringify(mockData) : undefined;
          fetchMock.mockResponseOnce(
            () =>
              new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve(new Response(response, { status: happyStatus })),
                  delay,
                ),
              ),
          );
          return mockData;
        }

        it("should have default timeout", async () => {
          const mockData = mockDelayedResponse(DEFAULT_TIMEOUT - 1);
          let promise = fn(URL, { ...options });
          await Promise.all([
            vi.runAllTimersAsync(),
            expect(promise).resolves.toEqual(mockData),
          ]);

          mockDelayedResponse(DEFAULT_TIMEOUT + 1);
          promise = fn(URL, { ...options });
          await Promise.all([
            vi.runAllTimersAsync(),
            expect(promise).rejects.toThrow(TimeoutError),
          ]);
        });

        it("should never timeout if timeout is set to 0", async () => {
          const mockData = mockDelayedResponse(Infinity);
          const promise = fn(URL, { ...options, timeout: 0 });
          await Promise.all([
            vi.runAllTimersAsync(),
            expect(promise).resolves.toEqual(mockData),
          ]);
        });

        it("should complete under timeout", async () => {
          const mockData = mockDelayedResponse(TIMEOUT - 1);
          const promise = fn(URL, { ...options, timeout: TIMEOUT });
          await Promise.all([
            vi.runAllTimersAsync(),
            expect(promise).resolves.toEqual(mockData),
          ]);
        });

        it("should time out", async () => {
          mockDelayedResponse(TIMEOUT + 1);
          const promise = fn(URL, { ...options, timeout: TIMEOUT });
          await Promise.all([
            vi.runAllTimersAsync(),
            expect(promise).rejects.toThrow(TimeoutError),
          ]);
        });
      });

      it("should throw a HTTP error with custom message for a failed request", async () => {
        const promises = Object.entries(NetworkErrors).map(
          async ([status, error]) => {
            fetchMock.mockResponseOnce(
              JSON.stringify({
                message: ERROR_MESSAGE,
              }),
              {
                status: Number(status),
              },
            );

            const errorInstance = new error(ERROR_MESSAGE);
            await expect(fn(URL)).rejects.toThrow(errorInstance);
            expect(loggerMock.error).toHaveBeenCalledWith(
              `Request failed for ${URL}:`,
              expect.any(Response),
            );
          },
        );
        await Promise.all(promises);
      });

      it("should throw ConnectionError for a fetch exception", async () => {
        const baseError = new Error(ERROR_MESSAGE);
        const connectionError = new ConnectionError(
          `Network error while fetching: ${URL}`,
          baseError,
        );
        fetchMock.mockRejectOnce(baseError);

        await expect(fn(URL)).rejects.toThrow(connectionError);
        expect(loggerMock.error).toHaveBeenCalledWith(
          `Fetch error for ${URL}:`,
          baseError,
        );
      });

      if (!returnsData) return;

      it("should throw an error for invalid JSON response", async () => {
        const status = 200;
        fetchMock.mockResponseOnce("{,", { status });

        await expect(fn(URL)).rejects.toThrow(
          new Error(`Invalid JSON response (status ${status}) from ${URL}`, {
            cause: expect.any(SyntaxError),
          }),
        );
        expect(loggerMock.error).toHaveBeenCalledWith(
          `Invalid JSON response from ${URL}:`,
          expect.any(Response),
        );
      });
    });
  }

  testVerb({
    verb: "GET",
    options: {},
    happyStatus: 200,
  });

  testVerb({
    verb: "POST",
    options: { body: BODY },
    happyStatus: 201,
    expectedCallParam: {
      body: JSON.stringify(BODY),
      headers: { "Content-Type": "application/json" },
    },
  });

  testVerb({
    verb: "PUT",
    options: { body: BODY },
    happyStatus: 200,
    expectedCallParam: {
      body: JSON.stringify(BODY),
      headers: { "Content-Type": "application/json" },
    },
  });

  testVerb({
    verb: "DELETE",
    options: {},
    happyStatus: 204,
  });
});
