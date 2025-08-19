import { testSchema } from "@/tests/schemas.ts";
import { userProfileSchema } from "@/schemes/user.schema.ts";

const VALID_EMAIL = "user@mail.com";
const INVALID_EMAIL = "user";

describe("userProfileSchema", () => {
  testSchema(userProfileSchema, {
    id: { happy: [5, 1000, 0], sad: [-12, null, "asd"] },
    email: { happy: [VALID_EMAIL], sad: [INVALID_EMAIL, ""] },
    name: { happy: ["user"], sad: [null] },
    profilePictureUrl: {
      happy: ["https://url.com", "http://url.com", undefined],
    },
  });
});
