// Defines the available tuition delivery modes.
export type TuitionMode = "Online" | "Offline"

// Defines the possible admin approval statuses for a tuition.
export type ApprovalStatus = "pending" | "approved" | "rejected"

// Defines the class time options a tutor can offer.
export type TuitionClassTime =
  | "Morning (8:00 AM - 12:00 PM)"
  | "Afternoon (12:00 PM - 4:00 PM)"
  | "Evening (4:00 PM - 8:00 PM)"
  | "Flexible / Discuss with Tutor"

// Describes the tuition data submitted when a tutor creates a listing.
export type TuitionFormData = {
  title: string
  subject: string
  classLevel: string
  mode: TuitionMode
  location: string
  monthlyFee: number
  daysPerWeek: number
  classTimes: TuitionClassTime[]
  description: string
  bannerImage: string
  isActive: boolean
}

// Describes a saved tuition, including its database ID.
export type Tuition = TuitionFormData & {
  _id: string
  tutorId: string
  tutorName: string
  tutorEmail: string
  approvalStatus: ApprovalStatus
  createdAt: string
}

// Public API responses do not contain the tutor's identity.
export type PublicTuition = Omit<Tuition, "tutorId" | "tutorName" | "tutorEmail">

// Describes the fields a tutor can edit on a tuition.
export type TuitionUpdateData = Pick<
  TuitionFormData,
  "location" | "monthlyFee" | "daysPerWeek" | "mode" | "bannerImage" | "description"
>

// Describes the optional tutor profile fields returned with tuition details.
export type TutorDetails = {
  name?: string
  email?: string
  image?: string | null
  phone?: string | null
  bio?: string | null
  education?: string
  experience?: string
  expertise?: string
}

// Groups a tuition with its tutor profile when available.
export type TuitionDetails = {
  tuition: PublicTuition
  tutor?: TutorDetails
}

// Describes the public tuition results and pagination details from the API.
export type TuitionListing = {
  tuitions: PublicTuition[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
