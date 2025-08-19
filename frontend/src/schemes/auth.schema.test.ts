import { testSchema } from "@/tests/schemas.ts";
import { loginSchema, registerSchema } from "@/schemes/auth.schema.ts";

const VALID_EMAIL = "user@mail.com";
const INVALID_EMAIL = "user";

const VALID_PASSWORD = "pass1234!";
const INVALID_PASSWORD = "";

describe("loginSchema", () => {
  testSchema(loginSchema, {
    email: { happy: [VALID_EMAIL], sad: [INVALID_EMAIL, ""] },
    password: { happy: [VALID_PASSWORD], sad: [INVALID_PASSWORD, ""] },
  });
});

describe("registerSchema", () => {
  testSchema(registerSchema, {
    email: { happy: [VALID_EMAIL], sad: [INVALID_EMAIL, ""] },
    password: { happy: [VALID_PASSWORD], sad: [INVALID_PASSWORD, ""] },
    confirmPassword: { happy: [VALID_PASSWORD] },
    firstName: { happy: ["foo"], sad: ["a", ""] },
    lastName: { happy: ["bar"], sad: ["b", ""] },
    birthDate: { happy: [new Date()], sad: [null] },
  });
});
