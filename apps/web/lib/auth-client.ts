import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type UserRole = "user" | "admin"
export type UserPlan = "free" | "premium"

export interface AuthUser {
  role: UserRole
  plan: UserPlan
}

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [
    inferAdditionalFields<unknown, {
      user: {
        role: { type: "string", input: false }
        plan: { type: "string", input: false }
      }
    }>(),
  ],
})