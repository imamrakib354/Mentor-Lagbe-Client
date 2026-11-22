// Describes an application's progress after submission.
export type ApplicationStatus = "pending" | "accepted" | "rejected"

// Fields submitted by the student; the backend supplies identity and snapshots.
export type CreateApplicationData = {
  tuitionId: string
  phone: string
  preferredSchedule: string
  learningNote: string
}

// Describes the application and tuition details saved when a student applies.
export type ApplicationFormData = {
  tuitionId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  tutorId: string
  tutorName: string
  tutorEmail: string
  tuitionTitle: string
  bannerImage: string
  subject: string
  classLevel: string
  monthlyFee: number
  phone: string
  preferredSchedule: string
  learningNote: string
  status: ApplicationStatus
  createdAt: string
}

// Describes a saved application with its database ID.
export type Application = ApplicationFormData & { _id: string }

// Describes filtered applications and counts across their statuses.
export type ApplicationListing = {
  applications: Application[]
  counts: { all: number; pending: number; accepted: number; rejected: number }
}
