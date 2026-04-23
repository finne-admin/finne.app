import { Storage } from "@google-cloud/storage"
import path from "path"

const bucketName =
  process.env.REPORTS_BUCKET || process.env.REWARDS_BUCKET || process.env.AVATARS_BUCKET
const storage = new Storage()

const sanitizeFileName = (value: string) => value.replace(/\s+/g, "-").toLowerCase()

export const uploadReportImage = async (
  filePath: string,
  originalName: string,
  userId: string,
  kind: "user" | "admin",
  mimeType?: string | null
) => {
  if (!bucketName) {
    throw new Error("REPORTS_BUCKET no está configurado y no hay bucket alternativo disponible")
  }

  const bucket = storage.bucket(bucketName)
  const safeName = sanitizeFileName(originalName)
  const ext = path.extname(safeName) || ".png"
  const destination = `reports/${kind}/${userId}/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`

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
