import { render, screen, waitFor, fireEvent } from "@/tests/setup";
import { vi } from "vitest";
import { AuthModal } from "@/components/auth/AuthModal.tsx";
import { authServiceMock } from "@/tests/mocks/services/AuthService.mock.ts";
import type { UserProfile } from "@/schemes/user.schema.ts";
import { UnauthorizedError } from "@/errors/http/UnauthorizedError.ts";
import { ConflictError } from "@/errors/http/ConflictError.ts";
import { RouterMock } from "@/tests/mocks/Router.mock.tsx";
import {
  LOGIN_AUTH_ERROR,
  LOGIN_GENERIC_ERROR,
  REGISTER_CONFLICT_ERROR,
  REGISTER_GENERIC_ERROR,
} from "@/constants/errors/form-errors/auth.ts";
import { act } from "@testing-library/react";
import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import type { ExposedOnSubmitForm } from "@/types/form-props.ts";

interface ErrorTest<TForm extends object> {
  name: string;
  error: Error;
  field?: keyof TForm;
  expectedErrorText: string;
}

const {
  USER_PROFILE,
  LOGIN_TAB_TEXT,
  REGISTER_TAB_TEXT,
  MOCKED_LOGIN_ID,
  MOCKED_REGISTER_ID,
  MOCKED_LOGIN_FORM,
  MOCKED_REGISTER_FORM,
} = vi.hoisted(() => {
  const USER_PROFILE: UserProfile = {
    id: 1,
    email: "email@mail.com",
    firstName: "foo",
    lastName: "bar",
    profilePictureUrl: undefined,
  };

  type MockFormType<TForm extends object> = Pick<
    ExposedOnSubmitForm<TForm>,
    "setFieldError" | "setTopLevelError"
  >;
  const MOCKED_LOGIN_FORM: MockFormType<LoginType> = {
    setFieldError: vi.fn(),
    setTopLevelError: vi.fn(),
  };
  const MOCKED_REGISTER_FORM: MockFormType<RegisterType> = {
    setFieldError: vi.fn(),
    setTopLevelError: vi.fn(),
  };

  return {
    USER_PROFILE,
    LOGIN_TAB_TEXT: /login/i,
    REGISTER_TAB_TEXT: /register/i,
    MOCKED_LOGIN_ID: "mocked-form-login",
    MOCKED_REGISTER_ID: "mocked-form-register",
    MOCKED_LOGIN_FORM,
    MOCKED_REGISTER_FORM,
  };
});

vi.mock("./LoginForm.tsx", () => ({
  LoginForm: vi.fn(({ onSubmit }) => (
    <button
      data-testid={"mocked-form-login"}
      onClick={() => onSubmit({}, MOCKED_LOGIN_FORM)}
    />
  )),
}));

vi.mock("./RegisterForm.tsx", () => ({
  RegisterForm: vi.fn(({ onSubmit }) => (
    <button
      data-testid={"mocked-form-register"}
      onClick={() => onSubmit({}, MOCKED_REGISTER_FORM)}
    />
  )),
}));

const getLoginTab = () => screen.getByText(LOGIN_TAB_TEXT);
const getLoginContent = () => screen.getByTestId(MOCKED_LOGIN_ID);

const getRegisterTab = () => screen.getByText(REGISTER_TAB_TEXT);
const getRegisterContent = () => screen.getByTestId(MOCKED_REGISTER_ID);

describe("AuthModal", () => {
  const router = new RouterMock([
    { path: "/auth", Component: AuthModal },
    "/dashboard",
    "/profile-info",
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a login and register tabs", () => {
    render(router.render("/auth"));
    expect(getLoginTab()).toBeInTheDocument();
    expect(getRegisterTab()).toBeInTheDocument();
  });

  it("renders each tab's content and switches between them", async () => {
    render(router.render("/auth"));

    const loginTab = getLoginTab();
    const registerTab = getRegisterTab();

    expect(getLoginContent()).toBeVisible();
    expect(getRegisterContent()).not.toBeVisible();

    await act(() => fireEvent.click(registerTab));
    await waitFor(() => {
      expect(getLoginContent()).not.toBeVisible();
      expect(getRegisterContent()).toBeVisible();
    });

    await act(() => fireEvent.click(loginTab));
    await waitFor(() => {
      expect(getLoginContent()).toBeVisible();
      expect(getRegisterContent()).not.toBeVisible();
    });
  });

  function executeErrorTest<TForm extends object>(
    tab: "login" | "register",
    { name, error, field, expectedErrorText }: ErrorTest<TForm>,
  ) {
    it(name, async () => {
      render(router.render("/auth"));

      const forms = {
        login: {
          button: getLoginContent,
          form: MOCKED_LOGIN_FORM,
          serviceCall: authServiceMock.login,
        },
        register: {
          button: getRegisterContent,
          form: MOCKED_REGISTER_FORM,
          serviceCall: authServiceMock.register,
        },
      };
      const { button, form, serviceCall } = forms[tab];
      serviceCall.mockRejectedValueOnce(error);

      await router.expectRouteActive("/auth");
      await act(() => fireEvent.click(button()));
      await router.expectRouteActive("/auth");

      if (field)
        expect(form.setFieldError).toHaveBeenCalledWith(
          field,
          expectedErrorText,
        );
      else
        expect(form.setTopLevelError).toHaveBeenCalledWith(expectedErrorText);
    });
  }

  describe("login attempt", () => {
    it("succeeds with valid login and redirects to profile /dashboard", async () => {
      authServiceMock.login.mockResolvedValueOnce(USER_PROFILE);
      render(router.render("/auth"));

      await router.expectRouteActive("/auth");
      await act(() => fireEvent.click(getLoginContent()));
      expect(authServiceMock.login).toHaveBeenCalled();
      await router.expectRouteActive("/dashboard");
    });

    describe("shows errors for", () => {
      const errors: ErrorTest<LoginType>[] = [
        {
          name: "unauthorized error",
          error: new UnauthorizedError(),
          field: "password",
          expectedErrorText: LOGIN_AUTH_ERROR,
        },
        {
          name: "generic error",
          error: new Error("generic error"),
          expectedErrorText: LOGIN_GENERIC_ERROR,
        },
      ];

      errors.forEach((e) => executeErrorTest("login", e));
    });
  });

  describe("register attempt", () => {
    it("succeeds with valid register and redirect to /profile-info", async () => {
      authServiceMock.register.mockResolvedValueOnce(USER_PROFILE);
      render(router.render("/auth"));

      await router.expectRouteActive("/auth");
      fireEvent.click(getRegisterTab());
      fireEvent.click(getRegisterContent());
      expect(authServiceMock.register).toHaveBeenCalled();
      await router.expectRouteActive("/profile-info");
    });

    describe("shows errors for", () => {
      const errors: ErrorTest<RegisterType>[] = [
        {
          name: "conflict error",
          error: new ConflictError(),
          field: "email",
          expectedErrorText: REGISTER_CONFLICT_ERROR,
        },
        {
          name: "generic error",
          error: new Error("generic error"),
          expectedErrorText: REGISTER_GENERIC_ERROR,
        },
      ];

      errors.forEach((e) => executeErrorTest("register", e));
    });
  });
});
