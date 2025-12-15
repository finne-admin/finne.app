import { getFirebaseMessaging } from "./firebaseAdmin"

interface ReminderPayload {
  userId: string
  reminderLabel: string
  reminderIso: string
}

export async function sendReminderToTokens(
  tokens: string[],
  payload: ReminderPayload
): Promise<{ successCount: number; failedTokens: string[] }> {
  if (!tokens.length) {
    return { successCount: 0, failedTokens: [] }
  }

  const messaging = getFirebaseMessaging()
  const message = {
    tokens,
    notification: {
      title: "¡Hora de tu pausa activa!",
      body: "Toca para registrar tu ejercicio del día",
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
