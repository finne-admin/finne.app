import { Storage } from "@google-cloud/storage"
import path from "path"

const bucketName = process.env.REWARDS_BUCKET
const storage = new Storage()

export const uploadRewardImage = async (filePath: string, originalName: string, mimeType?: string | null) => {
  if (!bucketName) {
    throw new Error("REWARDS_BUCKET no está configurado")
  }

  const bucket = storage.bucket(bucketName)
  const safeName = originalName.replace(/\s+/g, "-").toLowerCase()
  const destination = `rewards/${Date.now()}-${Math.round(Math.random() * 1e6)}-${path.basename(
    safeName
  )}`

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
