import type {
  Tuition,
  TuitionDetails,
  TuitionFormData,
  TuitionListing,
} from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

type CreateTuitionResponse = {
  acknowledged: boolean
  insertedId?: string
}

// Sends a new tuition to the backend.
export async function createTuition(
  tuition: TuitionFormData
): Promise<CreateTuitionResponse> {
  const response = await fetch(`${API_BASE_URL}/tuitions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(tuition),
  })

  if (!response.ok) {
    throw new Error("Could not submit the tuition. Please try again.")
  }

  return response.json()
}

// Fetches tuitions from the backend; this currently expects an array response.
export async function getTuitions(): Promise<Tuition[]> {
  const response = await fetch(`${API_BASE_URL}/tuitions`)

  if (!response.ok) {
    throw new Error("Could not load tuitions. Please try again.")
  }

  return response.json()
}

// Fetches a page of public tuitions using the search and filter query string.
export async function getPublicTuitions(
  query = ""
): Promise<TuitionListing> {
  const response = await fetch(
    `${API_BASE_URL}/tuitions${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Could not load tuitions. Please try again.")
  }

  return response.json()
}

// Fetches one tuition by ID and includes tutor details when provided by the API.
export async function getTuitionById(
  id: string
): Promise<TuitionDetails | null> {
  const response = await fetch(`${API_BASE_URL}/tuitions/${id}`, {
    cache: "no-store",
  })

  if (response.status === 404) return null

  if (!response.ok) {
    throw new Error("Could not load this tuition. Please try again.")
  }

  const data = (await response.json()) as Tuition | TuitionDetails | null

  if (!data) return null

  return "tuition" in data ? data : { tuition: data }
}

// Filters the fetched tuitions to those belonging to the given tutor.
export async function getTutorTuitions(tutorId: string): Promise<Tuition[]> {
  const tuitions = await getTuitions()
  return tuitions.filter((tuition) => tuition.tutorId === tutorId)
}
