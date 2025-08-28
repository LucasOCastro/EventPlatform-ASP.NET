import { LoginForm } from "./LoginForm";
import type { LoginType } from "@/schemes/auth.schema.ts";
import { testForm } from "@/tests/forms";

describe("LoginForm", () => {
  testForm<LoginType>({
    component: (onSubmit) => <LoginForm onSubmit={onSubmit} />,
    submitButton: "login",
    formShape: {
      email: { query: { label: "email" } },
      password: { query: { label: "password" } },
    },
    happyPaths: {
      name: "valid",
      data: {
        email: "valid@mail.com",
        password: "abAB12!",
      },
    },
    sadPaths: [
      {
        name: "missing email",
        data: {
          email: "",
          password: "abAB12!",
        },
      },
      {
        name: "missing password",
        data: {
          email: "valid@mail.com",
          password: "",
        },
      },
    ],
  });
});
