import { type FC } from "react";
import { Tabs } from "@mantine/core";
import { LoginForm } from "@/components/auth/LoginForm.tsx";
import { RegisterForm } from "@/components/auth/RegisterForm.tsx";
import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import { useAuth } from "@/contexts/AuthProvider.tsx";
import { UnauthorizedError } from "@/errors/http/UnauthorizedError.ts";
import type { ExposedOnSubmitForm } from "@/types/form-props.ts";

import {
  LOGIN_AUTH_ERROR,
  LOGIN_GENERIC_ERROR,
  REGISTER_CONFLICT_ERROR,
} from "@/constants/errors/form-errors/auth.ts";
import { ConflictError } from "@/errors/http/ConflictError.ts";
import { useNavigate } from "react-router";

export const AuthModal: FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function onLoginSubmit(
    data: LoginType,
    form: ExposedOnSubmitForm<LoginType>,
  ) {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        form.setFieldError("password", LOGIN_AUTH_ERROR);
      } else {
        form.setTopLevelError(LOGIN_GENERIC_ERROR);
      }
    }
  }

  async function onRegisterSubmit(
    data: RegisterType,
    form: ExposedOnSubmitForm<RegisterType>,
  ) {
    try {
      await register(data);
      navigate("/profile-info");
    } catch (err) {
      if (err instanceof ConflictError) {
        form.setFieldError("email", REGISTER_CONFLICT_ERROR);
      } else {
        form.setTopLevelError(LOGIN_GENERIC_ERROR);
      }
    }
  }

  return (
    <>
      <Tabs defaultValue="login">
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <LoginForm onSubmit={onLoginSubmit} />
        </Tabs.Panel>

        <Tabs.Panel value="register">
          <RegisterForm onSubmit={onRegisterSubmit} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
