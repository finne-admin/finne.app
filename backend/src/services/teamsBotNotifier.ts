type TeamsBotPayload = {
  message?: string
  slotLabel?: string
  slotIso?: string
}

const getEnv = (key: string): string | undefined => {
  const value = process.env[key]
  return value && value.trim().length ? value.trim() : undefined
}

export async function notifyTeamsBot(payload: TeamsBotPayload): Promise<boolean> {
  const url = getEnv("BOT_NOTIFY_URL")
  const apiKey = getEnv("BOT_NOTIFY_KEY")
  if (!url || !apiKey) return false

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch (error) {
    console.error("Teams bot notify failed:", error)
    return false
  }
}
