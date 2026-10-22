import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Keep these fields in sync with `user.additionalFields` in the backend auth
 * configuration. `input: false` prevents clients from assigning their own
 * role or plan during sign-up.
 */
const additionalUserFields = {
  role: {
    type: "string",
    required: true,
    defaultValue: "user",
    input: false,
  },
  plan: {
    type: "string",
    required: true,
    defaultValue: "free",
    input: false,
  },
  isBanned: {
    type: "boolean",
    required: true,
    defaultValue: false,
    input: false,
  },
  bannedUntil: {
    type: "date",
    required: false,
    input: false,
  },
} as const;

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [
    inferAdditionalFields({
      user: additionalUserFields,
    }),
  ],
});
