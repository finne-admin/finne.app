import { readFileSync } from "fs"
import path from "path"
import { getFirebaseMessaging } from "./firebaseAdmin"

interface ReminderPayload {
  userId: string
  reminderLabel: string
  reminderIso: string
}

interface TipPayload {
  userId: string
  tipLabel: string
  tipIso: string
}

let cachedTips: string[] | null = null

function loadTips(): string[] {
  if (cachedTips) return cachedTips
  try {
    const filePath = path.resolve(__dirname, "../data/tips.json")
    const raw = readFileSync(filePath, "utf-8")
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      cachedTips = parsed.map((item) => String(item)).filter(Boolean)
      if (cachedTips.length) return cachedTips
    }
  } catch (error) {
    console.warn("Falling back to default tips", error)
  }
  cachedTips = ["Consejo: mueve el cuerpo un minuto para recargar energia."]
  return cachedTips
}

export async function sendReminderToTokens(
  tokens: string[],
  payload: ReminderPayload
): Promise<{ successCount: number; failedTokens: string[] }> {
  if (!tokens.length) {
    return { successCount: 0, failedTokens: [] }
  }

  const messaging = getFirebaseMessaging()
  const reminderTitles = [
    "Es hora de tu pausa activa!💪",
    "Un respiro para recargar energias!🔋",
    "Tu bienestar es importante! 💼 Haz tu pausa activa ahora",
    "Es hora de moverte! 🤸‍♀️ Dedica un momento para ti.",
    "Pausa activa! 1 minuto para cuidar tu salud. 🌟 Tu puedes!",
    "Pequenos movimientos, grandes beneficios! Toca moverte.💡",
  ]
  const body = reminderTitles[Math.floor(Math.random() * reminderTitles.length)]

  const message = {
    tokens,
    notification: {
      title: "¡Pausa activa!",
      body,
    },

    data: {
      user_id: payload.userId,
      reminder_time: payload.reminderLabel,
      generated_at: payload.reminderIso,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        icon: "/logoprincipalRecurso 4@4x.png",
      },
    },
  }

  const response = await messaging.sendEachForMulticast(message)
  const failedTokens: string[] = []

  response.responses.forEach((res, idx) => {
    if (res.success) return

    const token = tokens[idx]
    failedTokens.push(token)

    const errorCode = res.error?.code ?? "unknown"
    const errorMessage = res.error?.message ?? "No error message"
    console.warn("FCM send failure", {
      tokenSnippet: `${token.slice(0, 10)}…`,
      errorCode,
      errorMessage,
      reminderLabel: payload.reminderLabel,
      userId: payload.userId,
    })
  })

  return {
    successCount: response.successCount,
    failedTokens,
  }
}

export async function sendTipToTokens(
  tokens: string[],
  payload: TipPayload
): Promise<{ successCount: number; failedTokens: string[] }> {
  if (!tokens.length) {
    return { successCount: 0, failedTokens: [] }
  }

  const tips = loadTips()
  const tip = tips[Math.floor(Math.random() * tips.length)]

  const messaging = getFirebaseMessaging()
  const message = {
    tokens,
    notification: {
      title: "Consejo",
      body: tip,
    },
    data: {
      user_id: payload.userId,
      tip_time: payload.tipLabel,
      generated_at: payload.tipIso,
      notification_type: "tip",
    },
    webpush: {
      headers: {
        Urgency: "normal",
      },
      notification: {
        icon: "/logoprincipalRecurso 4@4x.png",
      },
    },
  }

  const response = await messaging.sendEachForMulticast(message)
  const failedTokens: string[] = []

  response.responses.forEach((res, idx) => {
    if (res.success) return

    const token = tokens[idx]
    failedTokens.push(token)

    const errorCode = res.error?.code ?? "unknown"
    const errorMessage = res.error?.message ?? "No error message"
    console.warn("FCM send failure", {
      tokenSnippet: `${token.slice(0, 10)}.`,
      errorCode,
      errorMessage,
      tipLabel: payload.tipLabel,
      userId: payload.userId,
    })
  })

  return {
    successCount: response.successCount,
    failedTokens,
  }
}
