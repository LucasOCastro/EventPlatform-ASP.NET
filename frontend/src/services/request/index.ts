import type { IRequestService } from "@/services/request/IRequestService.ts";
import { FetchRequestService } from "@/services/request/FetchRequestService.ts";

export const requestService: IRequestService = new FetchRequestService();
