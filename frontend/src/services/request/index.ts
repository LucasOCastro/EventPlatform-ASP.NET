import type { IRequestService } from "@/services/request/IRequestService.ts";
import { FetchRequestService } from "@/services/request/FetchRequestService.ts";
import { logger } from "@/services/logger";

export const requestService: IRequestService = new FetchRequestService(logger);
