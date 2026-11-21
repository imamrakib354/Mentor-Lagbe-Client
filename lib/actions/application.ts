import type { Application, ApplicationFormData } from "@/lib/types/application"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Sends a student's application to the backend.
export async function createApplication(application: ApplicationFormData) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(application),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.message || "Could not submit your application.")
  }

  return response.json()
}

// Fetches applications belonging to the given student.
export async function getStudentApplications(
  applicantId: string
): Promise<Application[]> {
  const response = await fetch(
    `${API_BASE_URL}/applications/student/${encodeURIComponent(applicantId)}`,
    { cache: "no-store" }
  )

  if (!response.ok) throw new Error("Could not load your applications.")
  return response.json()
}
