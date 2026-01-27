import { Storage } from "@google-cloud/storage"
import path from "path"

const bucketName = process.env.AVATARS_BUCKET || process.env.REWARDS_BUCKET
const storage = new Storage()

export const uploadAvatarImage = async (
  filePath: string,
  originalName: string,
  userId: string,
  mimeType?: string | null
) => {
  if (!bucketName) {
    throw new Error("AVATARS_BUCKET no esta configurado")
  }

  const bucket = storage.bucket(bucketName)
  const safeName = originalName.replace(/\s+/g, "-").toLowerCase()
  const ext = path.extname(safeName) || ".png"
  const destination = `avatars/${userId}/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`

  await bucket.upload(filePath, {
    destination,
    metadata: {
      contentType: mimeType || "application/octet-stream",
      cacheControl: "public,max-age=31536000",
    },
  })

  const encodedPath = destination.split("/").map(encodeURIComponent).join("/")
  return `https://storage.googleapis.com/${bucketName}/${encodedPath}`
}
