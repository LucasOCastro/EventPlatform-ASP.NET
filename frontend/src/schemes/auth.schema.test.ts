import { testSchema } from "@/tests/schemas.ts";
import { loginSchema, registerSchema } from "@/schemes/auth.schema.ts";
import dayjs from "dayjs";

const VALID_EMAIL = "user@mail.com";
const INVALID_EMAIL = "user";

const VALID_PASSWORD = "pass1234!";
const INVALID_PASSWORD = "";

const DATE_14_YEARS_OLD = dayjs()
  .utc()
  .subtract(14, "years")
  .startOf("day")
  .toDate();
const DATE_13_YEARS_OLD = dayjs()
  .utc()
  .subtract(13, "years")
  .startOf("day")
  .toDate();

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
    birthDate: {
      happy: [DATE_14_YEARS_OLD],
      sad: [new Date(), DATE_13_YEARS_OLD],
    },
  });
});
