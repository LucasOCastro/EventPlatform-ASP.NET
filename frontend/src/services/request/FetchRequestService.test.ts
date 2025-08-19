import { FetchRequestService } from "./FetchRequestService.ts";
import type {
  IRequestService,
  RequestOptionDictionary,
  RequestVerb,
} from "@/services/request/IRequestService.ts";
import { NetworkErrors } from "@/errors/http";
import { TimeoutError } from "@/errors";
import { ConsoleLoggerService } from "@/services/logger/ConsoleLoggerService.ts";

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
  let requestService: IRequestService;
  beforeEach(() => {
    requestService = new FetchRequestService(new ConsoleLoggerService());
    fetchMock.resetMocks();
  });

  function testVerb<Verb extends RequestVerb>(params: VerbTest<Verb>) {
    const { verb, options, happyStatus, expectedCallParam } = params;
    const fn = (url: string, options?: RequestOptionDictionary[Verb]) =>
      requestService[verb.toLowerCase() as keyof IRequestService](url, options);

    const returnsData = happyStatus !== 204;

    it(`should handle a successful ${verb} request`, async () => {
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

    it(`should throw a HTTP error with custom message for a failed ${verb} request`, async () => {
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
          await expect(fn(URL)).rejects.toThrow(new error(ERROR_MESSAGE));
        },
      );
      await Promise.all(promises);
    });

    it(`should throw a TimeoutError for a timed out ${verb} request`, async () => {
      fetchMock.mockAbortOnce();

      await expect(fn(URL, { ...options, timeout: TIMEOUT })).rejects.toThrow(
        TimeoutError,
      );
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
