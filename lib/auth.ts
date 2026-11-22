import "server-only"

import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)

const db = client.db("MentorLagbeDB")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
      role: {
        type: ["admin", "tutor", "student"],
        // Development only: restrict privileged role assignment before deployment.
        input: true,
        defaultValue: "student",
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
      bannedUserMessage: "Your account is suspended. Please contact support.",
    })
  ],
})
