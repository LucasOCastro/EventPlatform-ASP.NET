import type { IAuthService } from "@/services/auth/IAuthService.ts";
import { type Mock, vi } from "vitest";

// Define the type for the mocked service
type MockedAuthService = {
  [K in keyof IAuthService]: Mock;
};

// Create the mock object with explicit mock functions
export const authServiceMock: MockedAuthService = {
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
};
