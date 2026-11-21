// Uploads an image through the local API and returns its public URL.
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  })

  const result = (await response.json()) as { imageUrl?: string; message?: string }

  if (!response.ok || !result.imageUrl) {
    throw new Error(result.message || "Could not upload the image.")
  }

  return result.imageUrl
}
