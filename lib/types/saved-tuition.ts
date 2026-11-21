import type { Tuition } from "@/lib/types/tuition"

// Describes a bookmark and the tuition currently associated with it.
export type SavedTuition = {
  _id: string
  studentId: string
  tuitionId: string
  createdAt: string
  tuition: Tuition | null
}
