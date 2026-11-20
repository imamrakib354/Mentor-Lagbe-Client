import type { Tuition, TuitionFormData } from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

type CreateTuitionResponse = {
  acknowledged: boolean
  insertedId?: string
}

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

export async function getTuitions(): Promise<Tuition[]> {
  const response = await fetch(`${API_BASE_URL}/tuitions`)

  if (!response.ok) {
    throw new Error("Could not load tuitions. Please try again.")
  }

  return response.json()
}

export async function getTutorTuitions(tutorId: string): Promise<Tuition[]> {
  const tuitions = await getTuitions()
  return tuitions.filter((tuition) => tuition.tutorId === tutorId)
}

export async function uploadTuitionBanner(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  })

  const result = (await response.json()) as { imageUrl?: string; message?: string }

  if (!response.ok || !result.imageUrl) {
    throw new Error(result.message || "Could not upload the banner image.")
  }

  return result.imageUrl
}
