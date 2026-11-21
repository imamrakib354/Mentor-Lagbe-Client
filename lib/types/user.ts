// Defines the account roles used by MentorLagbe.
export type UserRole = "student" | "tutor" | "admin"

// Describes the user information shown in the admin directory.
export type DirectoryUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
}
