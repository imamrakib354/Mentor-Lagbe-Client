export type TuitionMode = "Online" | "Offline"

export type ApprovalStatus = "pending" | "approved" | "rejected"

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
  description: string
  bannerImage: string
  approvalStatus: ApprovalStatus
  isActive: boolean
  createdAt: string
}

export type Tuition = TuitionFormData & {
  _id: string
}
