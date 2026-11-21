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
  tutorId: string
  tutorName: string
  tutorEmail: string
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
  approvalStatus: ApprovalStatus
  isActive: boolean
  createdAt: string
}

// Describes a saved tuition, including its database ID.
export type Tuition = TuitionFormData & {
  _id: string
}

// Describes the optional tutor profile fields returned with tuition details.
export type TutorDetails = {
  name?: string
  email?: string
  image?: string | null
  education?: string
  experience?: string
  expertise?: string
}

// Groups a tuition with its tutor profile when available.
export type TuitionDetails = {
  tuition: Tuition
  tutor?: TutorDetails
}

// Describes the public tuition results and pagination details from the API.
export type TuitionListing = {
  tuitions: Tuition[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
