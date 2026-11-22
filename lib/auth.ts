import "server-only"

import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin,jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)

export const db = client.db("MentorLagbeDB")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        if (ctx.body?.role !== undefined ||
            (ctx.body?.signupRole !== undefined &&
              ctx.body.signupRole !== "student" && ctx.body.signupRole !== "tutor")) {
          throw new APIError("BAD_REQUEST", { message: "Invalid signup role." })
        }
      }
      if (ctx.path === "/update-user" && ctx.body?.role !== undefined) {
        throw new APIError("FORBIDDEN", { message: "Role changes require an admin." })
      }
    }),
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
      roleSelectionRequired: { type: "boolean", required: false, input: false },
      role: {
        type: ["admin", "tutor", "student"],
        // The admin plugin protects this field; signup assigns it on the server.
        input: false,
        defaultValue: "student",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (ctx?.path === "/sign-up/email") {
            const role = ctx.body?.signupRole
            if (role !== undefined && role !== "student" && role !== "tutor") {
              throw new APIError("BAD_REQUEST", { message: "Invalid signup role." })
            }
            return { data: { ...user, role: role === "tutor" ? "tutor" : "student" } }
          }
          if (ctx?.path === "/callback/google" ||
              (ctx?.path === "/callback/:id" && ctx.params?.id === "google") ||
              (ctx?.path === "/sign-in/social" && ctx.body?.provider === "google")) {
            return { data: { ...user, role: "student", roleSelectionRequired: true } }
          }
        },
      },
    },
  },

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
      : {},

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    admin({
      defaultRole: "student",
      bannedUserMessage: "Your account is suspended. Please contact support.",
    }),

    jwt(),
  ],
})
