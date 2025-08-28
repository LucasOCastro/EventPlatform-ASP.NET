import { RegisterForm } from "./RegisterForm";
import {
  MAX_BIRTH_DATE,
  MIN_AGE,
  type RegisterType,
} from "@/schemes/auth.schema.ts";
import { testForm } from "@/tests/forms";
import { yearsFromDate } from "@/utils/date.ts";

describe("RegisterForm", () => {
  testForm<RegisterType>({
    component: (onSubmit) => <RegisterForm onSubmit={onSubmit} />,
    submitButton: "register",
    formShape: {
      email: { query: { label: "email" } },
      password: { query: { label: "^password$" } },
      confirmPassword: { query: { label: "confirm password" } },
      firstName: { query: { label: "first name" } },
      lastName: { query: { label: "last name" } },
      birthDate: {
        query: { label: "birth date" },
      },
    },
    happyPaths: {
      name: "data is valid",
      data: {
        email: "valid@mail.com",
        password: "abAB12!",
        confirmPassword: "abAB12!",
        firstName: "name",
        lastName: "last name",
        birthDate: MAX_BIRTH_DATE,
      },
    },
    sadPathFactory: {
      required: ["email", "firstName", "lastName", "password"],
      partials: [
        {
          name: "password confirm does not match",
          data: { confirmPassword: "other123" },
        },
        {
          name: `is younger than ${MIN_AGE}`,
          data: { birthDate: yearsFromDate(MAX_BIRTH_DATE, 1) },
        },
      ],
    },
  });
});
