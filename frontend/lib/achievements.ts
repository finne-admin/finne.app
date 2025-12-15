"use client"

import { apiFetch } from "@/lib/apiClient"

type AchievementEvent = string // permitimos triggers basados en eventos o condition_type

interface AchievementUnlock {
  id: string
  title: string
  description: string | null
}

// Alias para eventos especiales desde el frontend
const EVENT_ALIASES: Record<string, string> = {
  favorito_marcado: "ejercicio_favorito",
}

export async function checkAchievements(eventType: AchievementEvent, payload?: any) {
  const normalizedEvent = EVENT_ALIASES[eventType] ?? eventType

  try {
    const res = await apiFetch("/api/achievements/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: normalizedEvent,
        payload,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Error al comprobar logros")
    }

    const unlocked: AchievementUnlock[] = Array.isArray(data.unlocked) ? data.unlocked : []
    unlocked.forEach((achievement) =>
      showAchievementPopup(achievement.title, achievement.description ?? undefined)
    )

    return unlocked
  } catch (error) {
    console.error("Error al cargar el catálogo de logros", error)
    return []
  }
}

function showAchievementPopup(title: string, description?: string) {
  if (typeof window === "undefined") return

  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.bottom = "20px"
  div.style.right = "20px"
  div.style.background = "#111"
  div.style.color = "white"
  div.style.padding = "16px"
  div.style.borderRadius = "12px"
  div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)"
  div.style.zIndex = "9999"
  div.style.fontFamily = "sans-serif"
  div.style.fontSize = "14px"
  div.style.maxWidth = "280px"
  div.innerHTML = `<strong>🎉 ¡Logro desbloqueado!</strong><br>${title}${
    description ? `<br><span style="opacity:0.8">${description}</span>` : ""
  }`

  document.body.appendChild(div)

  setTimeout(() => {
    div.style.opacity = "0"
    div.style.transition = "opacity 0.8s ease-out"
    setTimeout(() => div.remove(), 1000)
  }, 3000)
}
