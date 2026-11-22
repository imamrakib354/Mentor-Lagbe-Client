import type {
  ApplicationFormData,
  ApplicationListing,
} from "@/lib/types/application"

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
  applicantId: string,
  query = ""
): Promise<ApplicationListing> {
  const response = await fetch(
    `${API_BASE_URL}/applications/student/${encodeURIComponent(applicantId)}${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  )

  if (!response.ok) throw new Error("Could not load your applications.")
  return response.json()
}

// Fetches applications for a tutor, optionally filtered by status.
export async function getTutorApplications(
  tutorId: string,
  query = ""
): Promise<ApplicationListing> {
  const response = await fetch(
    `${API_BASE_URL}/applications/tutor/${encodeURIComponent(tutorId)}${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  )

  if (!response.ok) throw new Error("Could not load applicants.")
  return response.json()
}

// Updates an application's status after the tutor's decision.
export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/status`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    }
  )

  if (!response.ok) throw new Error("Could not update the application status.")

  const result = await response.json()
  if (result.matchedCount === 0) throw new Error("Application not found.")
}

// Cancels a pending application by its ID.
export async function cancelApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/applications/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Could not cancel the application.")
  const result = await response.json()
  if (result.deletedCount !== 1) {
    throw new Error("Application was not found or is no longer pending.")
  }
}
