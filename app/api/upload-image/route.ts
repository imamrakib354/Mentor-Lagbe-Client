import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export const runtime = "nodejs"

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const maximumFileSize = 5 * 1024 * 1024

type ImgBBResponse = {
  success?: boolean
  data?: {
    display_url?: string
    url?: string
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return Response.json(
      { message: "Please sign in before uploading an image." },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const image = formData.get("image")

    if (!(image instanceof File)) {
      return Response.json({ message: "Choose an image to upload." }, { status: 400 })
    }

    if (!acceptedImageTypes.includes(image.type)) {
      return Response.json(
        { message: "Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      )
    }

    if (image.size > maximumFileSize) {
      return Response.json(
        { message: "Image size must be 5 MB or less." },
        { status: 400 }
      )
    }

    const apiKey = process.env.IMGBB_API_KEY

    if (!apiKey) {
      return Response.json(
        { message: "Image upload is not configured." },
        { status: 500 }
      )
    }

    const imageData = new FormData()
    const base64Image = Buffer.from(await image.arrayBuffer()).toString("base64")
    imageData.append("image", base64Image)

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    )
    const result = (await imgbbResponse.json()) as ImgBBResponse
    const imageUrl = result.data?.display_url || result.data?.url

    if (!imgbbResponse.ok || !result.success || !imageUrl) {
      return Response.json(
        { message: "ImgBB could not upload the image. Please try again." },
        { status: 502 }
      )
    }

    return Response.json({ imageUrl })
  } catch {
    return Response.json(
      { message: "Could not upload the image. Please try again." },
      { status: 500 }
    )
  }
}
