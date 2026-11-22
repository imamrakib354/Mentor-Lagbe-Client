// Describes a transaction returned by the payments API.
export type Payment = {
  _id: string
  userName?: string
  userEmail?: string
  role?: string
  plan?: string
  amount?: number | null
  currency?: string | null
  transactionId?: string | null
  status?: string
  paidDate?: string | null
}
