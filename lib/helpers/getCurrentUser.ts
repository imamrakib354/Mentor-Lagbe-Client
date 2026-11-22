import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Gets the signed-in user from the session on the server, or null if signed out.
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  return session?.user ?? null;
}
