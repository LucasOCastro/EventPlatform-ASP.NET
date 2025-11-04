import type { IRequestService } from "@/services/request/IRequestService.ts";
import { vi } from "vitest";

export class RequestServiceMock implements IRequestService {
  delete = vi.fn();
  get = vi.fn();
  post = vi.fn();
  put = vi.fn();
}
