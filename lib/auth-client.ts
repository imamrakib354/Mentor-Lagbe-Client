import { createAuthClient } from "better-auth/react"
import {
  inferAdditionalFields,
  adminClient,
  jwtClient
} from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    jwtClient(),

  ],
})

export const { signIn, signUp, signOut, useSession } = authClient