// Public review fields returned by the reviews API.
export type Review = {
  _id: string
  studentName: string
  rating: number
  comment: string
  createdAt: string
}

// A page of reviews and the tuition's overall rating summary.
export type ReviewListing = {
  reviews: Review[]
  total: number
  averageRating: number
  page: number
  limit: number
  totalPages: number
}
