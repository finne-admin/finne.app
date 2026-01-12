import admin from "firebase-admin"
import fs from "fs"
import path from "path"

let messagingClient: admin.messaging.Messaging | null = null

function loadServiceAccount(): admin.ServiceAccount {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline) {
    return JSON.parse(inline)
  }

  const defaultPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.resolve(process.cwd(), "elite-caster-474014-u9-d9c720c29a1d.json")

  if (!fs.existsSync(defaultPath)) {
    throw new Error(
      `No se encontró el archivo de credenciales de Firebase. Establece FIREBASE_SERVICE_ACCOUNT_PATH o FIREBASE_SERVICE_ACCOUNT_JSON`
    )
  }

  const fileContent = fs.readFileSync(defaultPath, "utf-8")
  return JSON.parse(fileContent)
}

export function getFirebaseMessaging(): admin.messaging.Messaging {
  if (messagingClient) return messagingClient

  const credential = admin.credential.cert(loadServiceAccount())
  admin.initializeApp({ credential })
  messagingClient = admin.messaging()
  return messagingClient
}
