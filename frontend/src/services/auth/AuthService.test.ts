import type { IAuthService } from "@/services/auth/IAuthService.ts";
import { AuthService } from "@/services/auth/AuthService.ts";
import { RequestServiceMock } from "@/tests/mocks/RequestService.mock.ts";
import { LoggerMock } from "@/tests/mocks/Logger.mock.ts";
import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import type { UserProfile } from "@/schemes/user.schema.ts";
import { ZodError } from "zod";
import { ConflictError } from "@/errors/http/ConflictError.ts";
import { UnauthorizedError } from "@/errors/http/UnauthorizedError.ts";
import { vi } from "vitest";

const USER: UserProfile = {
  id: 0,
  name: "test name",
  email: "user@mail.com",
};

const VALID_LOGIN: LoginType = {
  email: "user@mail.com",
  password: "pass1234!",
};

const VALID_REGISTER: RegisterType = {
  email: "user@mail.com",
  password: "pass1234!",
  confirmPassword: "pass1234!",
  firstName: "user",
  lastName: "name",
  birthDate: new Date(),
};

describe("AuthService", () => {
  const requestService = new RequestServiceMock();
  const logger = new LoggerMock();
  let authService: IAuthService;

  beforeEach(() => {
    authService = new AuthService(requestService, logger);
    vi.resetAllMocks();
  });

  it("should start with no user", () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it("should store and return the user on successful login", async () => {
    requestService.post.mockResolvedValue(USER);

    const result = await authService.login(VALID_LOGIN);
    expect(result).toEqual(USER);
    expect(authService.getCurrentUser()).toEqual(USER);
  });

  it("should store and return the user on successful register", async () => {
    requestService.post.mockResolvedValue(USER);

    const result = await authService.register(VALID_REGISTER);
    expect(result).toEqual(USER);
    expect(authService.getCurrentUser()).toEqual(USER);
  });

  it("should clear user on logout", async () => {
    requestService.post.mockResolvedValue(USER);

    await authService.login(VALID_LOGIN);
    expect(authService.getCurrentUser()).toEqual(USER);

    await authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });

  it("should update user on subsequent login if already logged in", async () => {
    requestService.post.mockResolvedValue(USER);
    await authService.login(VALID_LOGIN);

    const UPDATED_USER: UserProfile = { ...USER, name: "updated name" };
    requestService.post.mockResolvedValue(UPDATED_USER);
    const result = await authService.login(VALID_LOGIN);

    expect(result).toEqual(UPDATED_USER);
    expect(authService.getCurrentUser()).toEqual(UPDATED_USER);
  });

  it("should throw zod error for malformed register", async () => {
    const INVALID_REGISTER: RegisterType = { ...VALID_REGISTER, email: "a" };
    await expect(authService.register(INVALID_REGISTER)).rejects.toThrow(
      ZodError,
    );
  });

  it("should throw on unauthorized login", async () => {
    requestService.post.mockRejectedValue(new UnauthorizedError());
    await expect(authService.login(VALID_LOGIN)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw on register conflict", async () => {
    requestService.post.mockRejectedValue(new ConflictError());
    await expect(authService.register(VALID_REGISTER)).rejects.toThrow(
      ConflictError,
    );
  });
});
