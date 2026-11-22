// Uploads an image file or public URL through the local API.
export async function uploadImage(file: File | string): Promise<string> {
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
