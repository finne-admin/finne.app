"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { WistiaModalNotification } from "@/components/wistia-modal/wistia-modal-notification"
import { Skeleton } from "@/components/ui/skeleton"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { checkAchievements } from "@/lib/achievements"
import { checkWeeklyChallenges } from "@/lib/checkWeeklyChallenges"
import StreakPopup from "@/components/animations/StreakPopup"
import CategoryCountsPopover from "@/components/utils/CategoryCountsPopover"
import { getVideoExp } from "@/lib/experience"
import { apiGet, apiPost, apiDelete, apiFetch, API_BASE_URL } from "@/lib/apiClient"
import { useDailyQuota, DailyQuotaBar } from "@/components/utils/DailyQuotaBar"
import { SvelteVideoCard } from "@/components/svelte/SvelteVideoCard"

interface Asset {
  url: string
  width: number
  height: number
  type: string
}

interface WistiaMedia {
  id: number
  name: string
  description: string
  duration: number
  hashed_id: string
  assets: Asset[]
}

interface DepartmentUser {
  id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}

interface PendingInvite {
  id: string
  sender_user_id: string
  sender_name: string
  video1_hash?: string | null
  video2_hash?: string | null
}

interface SentInvite {
  id: string
  status: string
  receiver_name?: string | null
  video1_hash?: string | null
  video2_hash?: string | null
  created_at?: string | null
  accepted_at?: string | null
  pause_session_id?: string | null
}

interface VideoTagEntry {
  wistia_id: string
  categories: string[]
}

async function backendJson(path: string, options?: RequestInit) {
  const res = await apiFetch(path, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || "Error en la petición")
  }
  return data
}

function pickRandomThree<T>(arr: T[]): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

type Step = "selection" | "video1" | "countdown" | "video2" | "satisfaction" | "end"
const COUNTDOWN_SECONDS = 3

export default function NotificationPage() {
  const sharedPauseEnabled = false
  const [allVideos, setAllVideos] = useState<WistiaMedia[]>([])
  const [exercises, setExercises] = useState<WistiaMedia[]>([])
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<Step>("selection")
  const [showConfetti, setShowConfetti] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  const [streakHit, setStreakHit] = useState<number | null>(null)
  const [currentPauseId, setCurrentPauseId] = useState<string | null>(null)
  const [departmentUsers, setDepartmentUsers] = useState<DepartmentUser[]>([])
  const [departmentLoading, setDepartmentLoading] = useState(false)
  const [invites, setInvites] = useState<PendingInvite[]>([])
  const [invitesLoading, setInvitesLoading] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [pendingModalOpen, setPendingModalOpen] = useState(false)
  const [selectedInviteUser, setSelectedInviteUser] = useState<string>("")
  const [socialStatus, setSocialStatus] = useState<string | null>(null)
  const [socialBusy, setSocialBusy] = useState(false)
  const [inviteActionLoading, setInviteActionLoading] = useState<string | null>(null)
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([])
  const [pendingStartHashes, setPendingStartHashes] = useState<string[] | null>(null)
  const [autoStartInvite, setAutoStartInvite] = useState(false)
  const handledSentInvites = useRef<Set<string>>(new Set())
  const [activeInvite, setActiveInvite] = useState<{ id: string; receiverName: string } | null>(null)
  const [cancellingInvite, setCancellingInvite] = useState(false)
  const waitingOnInvite = Boolean(activeInvite)
  const [videoTags, setVideoTags] = useState<Record<string, string[]>>({})
  const [favoriteHashes, setFavoriteHashes] = useState<Set<string>>(new Set())
  const [svelteReady, setSvelteReady] = useState(false)

  const closeStreakCelebration = () => {
    setShowStreakCelebration(false)
    setStreakHit(null)
    setShowConfetti(false)
  }
  const POINTS_PER_PAUSE = 20 // 2 vídeos x 10 PA

  const { usedToday, remainingToday, loadingQuota, quotaError, refetchQuota, limit: dailyLimit } =
    useDailyQuota()

  const maxSelections = 2
  const selectedExerciseData = exercises.filter((ex) =>
    selectedVideos.includes(String(ex.id))
  )
  const canInvite =
    sharedPauseEnabled &&
    selectedVideos.length === maxSelections &&
    remainingToday > 0 &&
    !isStarting

  // 🔹 Obtener usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiGet("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Error obteniendo usuario:", err)
      }
    }
    fetchUser()
  }, [])

  const fetchInvites = async () => {
    try {
      setInvitesLoading(true)
      const data = await backendJson("/api/social/invites")
      setInvites(Array.isArray(data.invites) ? data.invites : [])
    } catch (error) {
      console.error("Error al obtener invitaciones:", error)
    } finally {
      setInvitesLoading(false)
    }
  }

  const fetchSentInvites = async () => {
    try {
      const data = await backendJson("/api/social/invites/sent")
      setSentInvites(Array.isArray(data.invites) ? data.invites : [])
    } catch (error) {
      console.error("Error al obtener invitaciones enviadas:", error)
    }
  }

  const fetchDepartmentUsers = async () => {
    try {
      setDepartmentLoading(true)
      const data = await backendJson("/api/social/department-users")
      setDepartmentUsers(Array.isArray(data.users) ? data.users : [])
    } catch (error) {
      console.error("Error al obtener compañeros:", error)
    } finally {
      setDepartmentLoading(false)
    }
  }

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await apiGet("/api/exercises/favorites")
      if (res.status === 401) {
        setFavoriteHashes(new Set())
        return
      }
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al cargar favoritos")
      }
      const list = Array.isArray(data.favorites) ? data.favorites : []
      setFavoriteHashes(new Set(list.map((fav: any) => fav.video_hashed_id || fav)))
    } catch (error) {
      console.error("Error al obtener favoritos:", error)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    fetchFavorites().catch(() => {})
  }, [user?.id, fetchFavorites])

  const handleFavoriteToggle = async (hashedId: string) => {
    if (!hashedId) return
    const original = new Set(favoriteHashes)
    const isFavorite = favoriteHashes.has(hashedId)

    setFavoriteHashes((prev) => {
      const updated = new Set(prev)
      if (isFavorite) {
        updated.delete(hashedId)
      } else {
        updated.add(hashedId)
      }
      return updated
    })

    try {
      const response = isFavorite
        ? await apiDelete("/api/exercises/favorites", { video_hashed_id: hashedId })
        : await apiPost("/api/exercises/favorites", { video_hashed_id: hashedId })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar favorito")
      }
      if (!isFavorite) {
        await checkAchievements("favorito_marcado")
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error)
      setFavoriteHashes(original)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.customElements?.get("svelte-video-card")) {
      setSvelteReady(true)
      return
    }
    const script = document.createElement("script")
    script.type = "module"
    script.src = "/svelte/svelte-lab.js"
    script.onload = () => setSvelteReady(true)
    script.onerror = () => setSvelteReady(false)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  useEffect(() => {
    if (!sharedPauseEnabled) return
    if (currentStep !== "selection") return

    fetchInvites().catch(() => {})
    fetchSentInvites().catch(() => {})

    const interval = setInterval(() => {
      fetchInvites().catch(() => {})
    }, 15000)
    const sentInterval = setInterval(() => {
      fetchSentInvites().catch(() => {})
    }, 15000)

    return () => {
      clearInterval(interval)
      clearInterval(sentInterval)
    }
  }, [currentStep])

  useEffect(() => {
    if (!sharedPauseEnabled) return
    if (!activeInvite || currentStep !== "selection") return
    const current = sentInvites.find((inv) => inv.id === activeInvite.id)
    if (!current) return

    if (current.status === "accepted" && !handledSentInvites.current.has(current.id)) {
      const hashes = [current.video1_hash, current.video2_hash].filter(Boolean) as string[]
      if (hashes.length === maxSelections) {
        handledSentInvites.current.add(current.id)
        setPendingStartHashes(hashes)
      }
    }

    if (current.status !== "pending") {
      setActiveInvite(null)
    }
  }, [sentInvites, activeInvite, maxSelections])

  useEffect(() => {
    if (!sharedPauseEnabled) return
    if (!autoStartInvite) return
    if (selectedExerciseData.length !== maxSelections) return
    setAutoStartInvite(false)
    handleStartExercise()
  }, [autoStartInvite, selectedExerciseData, maxSelections])

  useEffect(() => {
    if (!sharedPauseEnabled) return
    if (currentStep !== "selection") return
    if (!pendingStartHashes || pendingStartHashes.length !== maxSelections) return
    if (!allVideos.length) return

    const resolved = pendingStartHashes
      .map((hash) => allVideos.find((video) => video.hashed_id === hash))
      .filter(Boolean) as WistiaMedia[]

    if (resolved.length !== maxSelections) {
      setSocialStatus("No se encontraron los vídeos vinculados a la invitación.")
      setPendingStartHashes(null)
      return
    }

    setExercises(resolved)
    setSelectedVideos(resolved.map((video) => String(video.id)))
    setPendingStartHashes(null)
    setAutoStartInvite(true)
    setActiveInvite(null)
  }, [pendingStartHashes, allVideos, maxSelections, currentStep])

  // 🔹 Obtener vídeos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGet("/api/wistia/videos")
        if (!res.ok) throw new Error("Error al obtener vídeos")
        const data: WistiaMedia[] = await res.json()
        setAllVideos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar ejercicios")
      } finally {
        setIsLoading(false)
      }
    }
    const timer = setTimeout(() => fetchData(), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (allVideos.length > 0) setExercises(pickRandomThree(allVideos))
  }, [allVideos])

  useEffect(() => {
    if (exercises.length === 0) return
    const hashes = exercises.map((ex) => ex.hashed_id).filter(Boolean)
    if (hashes.length === 0) return

    let cancelled = false
    const fetchTags = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/tags`, {
          method: "POST",
          body: JSON.stringify({ video_hashes: hashes }),
        })
        if (!response.ok) throw new Error("Error al obtener etiquetas de los v�deos")
        const { tags }: { tags: VideoTagEntry[] } = await response.json()
        if (cancelled) return
        setVideoTags((prev) => {
          const next = { ...prev }
          tags.forEach((entry) => {
            next[entry.wistia_id] = entry.categories || []
          })
          return next
        })
      } catch (err) {
        console.error("Error al cargar etiquetas de los v�deos:", err)
      }
    }
    fetchTags()
    return () => {
      cancelled = true
    }
  }, [exercises])

  useEffect(() => {
    if (currentStep !== "countdown") return

    let remaining = COUNTDOWN_SECONDS
    setCountdown(remaining)

    const timer = setInterval(() => {
      remaining -= 1
      setCountdown(Math.max(remaining, 0))

      if (remaining <= 0) {
        clearInterval(timer)
        setCurrentStep("video2")
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [currentStep])

  // 🔹 Guardar satisfacción (solo actualiza)
  const saveSatisfactionData = async (level: number) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (!user?.id) throw new Error("Usuario no autenticado")
      if (!currentPauseId) throw new Error("No hay pausa activa para actualizar")

      const videoHashes = selectedExerciseData.map((ex) => ex.hashed_id)

      const tagsResponse = await apiFetch(`${API_BASE_URL}/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token || ""}`,
        },
        body: JSON.stringify({ video_hashes: videoHashes }),
      })

      if (!tagsResponse.ok) throw new Error("Error al obtener etiquetas")
      const { tags } = await tagsResponse.json()

      // ✅ Solo actualiza la pausa existente
      const updateRes = await apiFetch(`/api/active-pauses/${currentPauseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          satisfaction_level: level,
          tags,
          video_hash_ids: videoHashes,
        }),
      })
      if (!updateRes.ok) throw new Error("Error al actualizar satisfacción")
    } catch (err: any) {
      setSubmitError(err.message || "Error al guardar comentarios")
      console.error("Error de envío:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🔹 Crear pausa activa y sumar XP
  const handlePostVideoLogic = async () => {
    if (!user?.id) return
    try {
      const wistiaIds = selectedExerciseData.map((ex) => ex.hashed_id)
      const resolveRes = await apiPost("/api/active-pauses/resolve-videos", {
        hashes: wistiaIds,
      })
      if (!resolveRes.ok) throw new Error("Error resolviendo vídeos")

      const { video1_id, video2_id } = await resolveRes.json()

      // Crear pausa activa y guardar ID
      const res = await apiPost("/api/active-pauses", {
        user_id: user.id,
        video1_id,
        video2_id,
      })
      if (!res.ok) throw new Error("Error al crear pausa activa")
      const { pause } = await res.json()
      setCurrentPauseId(pause.id)

      // Calcular XP
      const videoMeta = selectedExerciseData.map((ex) => ({
        id: ex.id,
        hashed_id: ex.hashed_id,
        title: ex.name,
        category: ex.description,
      }))

      const totalExp = selectedExerciseData.reduce((acc, ex) => {
        const sec = Math.round(ex.duration || 0)
        return acc + getVideoExp(sec)
      }, 0)

      // Sumar XP
      if (totalExp > 0) {
        const xpRes = await apiPost("/api/xp/add", {
          user_id: user.id,
          points: totalExp,
          meta: {
            source: "active_pause",
            pause_id: pause.id,
            video1_id,
            video2_id,
            wistia_ids: wistiaIds,
            videos: videoMeta,
          },
        })

        if (!xpRes.ok) {
          const errText = await xpRes.text()
          console.error("❌ Error sumando XP:", xpRes.status, errText)
        } else {
          try {
            const data = await xpRes.json()
            console.log(`✅ XP sumada: +${data.added_points} (total: ${data.new_exp_total})`)
          } catch (err) {
            console.warn("⚠️ Error parsing XP response:", err)
          }
        }
      }

      await refetchQuota()
      await checkWeeklyChallenges(user.id, "active_pause_inserted", {
        created_at: new Date().toISOString(),
        video1_id,
        video2_id,
      })
      await checkAchievements("active_pause", {
        video1_id,
        video2_id,
        wistia_ids: wistiaIds,
      })
    } catch (e) {
      console.error("❌ Error en handlePostVideoLogic:", e)
    }
  }

  const sendInvite = async () => {
    if (selectedExerciseData.length !== 2 || !selectedInviteUser) {
      setSocialStatus("Selecciona los dos ejercicios e invita a un compañero.")
      return
    }
    try {
      setSocialBusy(true)
      const response = await backendJson("/api/social/invites", {
        method: "POST",
        body: JSON.stringify({
          receiverUserId: selectedInviteUser,
          videoHashes: selectedExerciseData.map((ex) => ex.hashed_id),
        }),
      })
      setSocialStatus("Invitación enviada.")
      setInviteModalOpen(false)
      const targetUser = departmentUsers.find((user) => user.id === selectedInviteUser)
      setSelectedInviteUser("")
      if (response?.invite?.id) {
        const label =
          `${targetUser?.first_name ?? ""} ${targetUser?.last_name ?? ""}`.trim() ||
          targetUser?.email ||
          "Compañer@"
        setActiveInvite({ id: response.invite.id, receiverName: label })
      }
      fetchInvites().catch(() => {})
      fetchSentInvites().catch(() => {})
    } catch (error: any) {
      setSocialStatus(error.message || "No se pudo enviar la invitación.")
    } finally {
      setSocialBusy(false)
    }
  }

  const handleAcceptInvite = async (invite: PendingInvite) => {
    try {
      setInviteActionLoading(invite.id)
      const data = await backendJson(`/api/social/invites/${invite.id}/accept`, { method: "POST" })
      const hashes = [data.video1_hash, data.video2_hash].filter(Boolean) as string[]
      if (hashes.length !== 2) {
        setSocialStatus("La invitación no tiene vídeos válidos.")
        return
      }
      setPendingStartHashes(hashes)
      setPendingModalOpen(false)
      setInvites((prev) => prev.filter((item) => item.id !== invite.id))
    } catch (error: any) {
      setSocialStatus(error.message || "No se pudo aceptar la invitación.")
    } finally {
      setInviteActionLoading(null)
    }
  }

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await backendJson(`/api/social/invites/${inviteId}/decline`, { method: "POST" })
      setInvites((prev) => prev.filter((item) => item.id !== inviteId))
      setSocialStatus("Invitación rechazada.")
    } catch (error: any) {
      setSocialStatus(error.message || "No se pudo rechazar la invitación.")
    }
  }

  const cancelCurrentInvite = async () => {
    if (!activeInvite) return
    try {
      setCancellingInvite(true)
      await backendJson(`/api/social/invites/${activeInvite.id}/cancel`, { method: "POST" })
      setActiveInvite(null)
      setSocialStatus("Invitación cancelada.")
      fetchSentInvites().catch(() => {})
    } catch (error: any) {
      setSocialStatus(error.message || "No se pudo cancelar la invitación.")
    } finally {
      setCancellingInvite(false)
    }
  }

  const handleVideoEnd = () => {
    if (currentStep === "video1") {
      setCurrentStep("countdown")
    } else if (currentStep === "video2") {
      setCurrentStep("satisfaction")
      void handlePostVideoLogic()
    }
    setIsStarting(false)
  }

  const handleEmojiSelect = async (emoji: string) => {
    const levels = ["😟", "😐", "🙂", "😀", "🤩"]
    const level = levels.indexOf(emoji) + 1
    await saveSatisfactionData(level)
    setChosenEmoji(emoji)
    setShowConfetti(true)
    setCurrentStep("end")
  }

  const handleStartExercise = () => {
    setIsStarting(true)
    setCurrentStep("video1")
  }

  const handleVideoSelect = (strId: string) => {
    setSelectedVideos((prev) => {
      if (prev.includes(strId)) return prev.filter((id) => id !== strId)
      if (prev.length >= 2) return prev
      return [...prev, strId]
    })
  }

  const openInviteModal = () => {
    if (!sharedPauseEnabled) return
    if (!canInvite) return
    if (departmentUsers.length === 0) {
      fetchDepartmentUsers().catch(() => {})
    }
    setInviteModalOpen(true)
  }

  const closeModal = () => {
    setCurrentStep("selection")
    setShowConfetti(false)
    setChosenEmoji(null)
    setSelectedVideos([])
    setIsStarting(false)
    setCurrentPauseId(null)
    if (allVideos.length) {
      setExercises(pickRandomThree(allVideos))
    }
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="rounded-xl aspect-[4/3]" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <StreakPopup
        open={showStreakCelebration}
        streak={streakHit ?? 0}
        onClose={closeStreakCelebration}
        autoCloseMs={2200}
        subtitle="¡Sigue así, estás on fire!"
      />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Elige tus Ejercicios
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Selecciona exactamente dos ejercicios para comenzar tu sesión
            </p>
            <DailyQuotaBar
              limit={dailyLimit}
              usedToday={usedToday}
              loading={loadingQuota}
              error={quotaError}
              pointsPerPause={POINTS_PER_PAUSE}
              unitLabel="AP"
            />
          </div>
          {error ? (
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : exercises.length === 0 ? (
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">No hay ejercicios disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {exercises.map((ex) => (
                <SvelteVideoCard
                  key={ex.id}
                  id={String(ex.id)}
                  hashedId={ex.hashed_id}
                  title={ex.name}
                  description={ex.description.replace(/<[^>]+>/g, "")}
                  duration={`${Math.round(ex.duration)}s`}
                  assets={ex.assets}
                  isSelected={selectedVideos.includes(String(ex.id))}
                  onSelect={handleVideoSelect}
                  tags={videoTags[ex.hashed_id] || []}
                  isFavorite={Boolean(ex.hashed_id && favoriteHashes.has(ex.hashed_id))}
                  onFavoriteToggle={handleFavoriteToggle}
                  disabled={
                    (selectedVideos.length >= maxSelections &&
                      !selectedVideos.includes(String(ex.id))) ||
                    remainingToday <= 0
                  }
                  scriptReady={svelteReady}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {selectedVideos.length === maxSelections
                  ? "¡Genial! Estás listo para empezar."
                  : `Selecciona ${
                      maxSelections - selectedVideos.length
                    } más para continuar`}
              </span>
            </div>
          )}

          {!isLoading && !error && (
            <div className="flex flex-col items-center gap-2">
              {socialStatus && (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1">
                  {socialStatus}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  onClick={handleStartExercise}
                  disabled={
                    selectedVideos.length !== maxSelections ||
                    isStarting ||
                    remainingToday <= 0 ||
                    waitingOnInvite
                  }
                  className={cn(
                    "px-8 py-3 text-lg transition-transform",
                    selectedVideos.length === maxSelections &&
                      remainingToday > 0 &&
                      "hover:scale-105 active:scale-95",
                    isStarting && "cursor-wait"
                  )}
                  size="lg"
                >
                  {isStarting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : remainingToday <= 0 ? (
                    "Límite diario alcanzado"
                  ) : (
                    "Iniciar Ejercicios"
                  )}
                </Button>
                {sharedPauseEnabled && (
                  <>
                    <Button
                      variant="outline"
                      onClick={openInviteModal}
                      disabled={!canInvite || socialBusy || waitingOnInvite}
                    >
                      Compartir Pausa
                    </Button>
                    {invitesLoading ? (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" /> Revisando invitaciones...
                      </span>
                    ) : invites.length > 0 ? (
                      <Button
                        variant="secondary"
                        className="border-emerald-400 text-emerald-800 bg-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.35)]"
                        onClick={() => setPendingModalOpen(true)}
                      >
                        Invitaci▋ pendiente ({invites.length})
                      </Button>
                    ) : null}
                  </>
                )}

                <CategoryCountsPopover />
              </div>
            </div>
          )}

          {!isLoading && !error && remainingToday <= 0 && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Has llegado al maximo de {dailyLimit} pausas por hoy.
            </p>
          )}
        </div>
      </div>

      {sharedPauseEnabled && activeInvite && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <h3 className="text-lg font-semibold">Esperando confirmación</h3>
              <p className="text-sm text-gray-600">
                Hemos invitado a <span className="font-medium text-gray-900">{activeInvite.receiverName}</span>.
                La sesión comenzará automáticamente cuando acepte.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={cancelCurrentInvite}
              disabled={cancellingInvite}
            >
              {cancellingInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancelar invitación"}
            </Button>
          </div>
        </div>
      )}

      {currentStep === "video1" && selectedExerciseData[0] && (
        <WistiaModalNotification
          hashedId={selectedExerciseData[0].hashed_id}
          onClose={closeModal}
          onVideoEnd={handleVideoEnd}
          isLoading={!selectedExerciseData[0].assets?.length}
        />
      )}

      {currentStep === "countdown" && (
        <CountdownTimer
          countdown={countdown}
          totalTime={COUNTDOWN_SECONDS}
          onSkip={() => setCurrentStep("video2")}
        />
      )}

      {currentStep === "video2" && selectedExerciseData[1] && (
        <WistiaModalNotification
          hashedId={selectedExerciseData[1].hashed_id}
          onClose={closeModal}
          onVideoEnd={handleVideoEnd}
        />
      )}

      {currentStep === "satisfaction" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl text-center text-gray-900 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              ¿Cómo te has sentido con el ejercicio?
            </h2>
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {submitError}
              </div>
            )}
            <div className="flex justify-center gap-2 text-4xl mt-6">
              {["😟", "😐", "🙂", "😀", "🤩"].map((emoji, index) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  disabled={isSubmitting}
                  className={cn(
                    "p-2 transform transition-all duration-150 hover:scale-125",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    chosenEmoji === emoji ? "scale-125" : "scale-100"
                  )}
                  aria-label={`Valorar ${index + 1} de 5`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {isSubmitting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando tu valoración...</span>
              </div>
            )}
            <p className="mt-6 text-sm text-gray-500">
              Tu opinión ayuda a mejorar futuras sesiones
            </p>
          </div>
        </div>
      )}

      {currentStep === "end" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">¡Gracias!</h2>
            {chosenEmoji && <p className="text-3xl mb-4">{chosenEmoji}</p>}
            <p className="text-gray-600 mb-4">
              Agradecemos tu valoración.
            </p>
            <Button onClick={closeModal}>Cerrar</Button>
          </div>
        </div>
      )}

      {sharedPauseEnabled && inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invitar a un compañer@</h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">
                Cerrar
              </button>
            </div>
            {departmentLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando compañeros…
              </div>
            ) : departmentUsers.length === 0 ? (
              <p className="text-sm text-gray-600">No hay compañeros disponibles en tu departamento.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {departmentUsers.map((user) => {
                  const label = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email
                  return (
                    <button
                      key={user.id}
                      onClick={() => setSelectedInviteUser(user.id)}
                      className={cn(
                        "w-full text-left border rounded-lg px-3 py-2 transition-colors",
                        selectedInviteUser === user.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"
                      )}
                    >
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  )
                })}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setInviteModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={sendInvite} disabled={!selectedInviteUser || socialBusy}>
                {socialBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar invitación"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {sharedPauseEnabled && pendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invitaciones pendientes</h3>
              <button onClick={() => setPendingModalOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">
                Cerrar
              </button>
            </div>
            {invites.length === 0 ? (
              <p className="text-sm text-gray-600">No tienes invitaciones por ahora.</p>
            ) : (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div key={invite.id} className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{invite.sender_name}</span> te ha invitado a una pausa activa.
                    </p>
                    <p className="text-xs text-gray-500">Vídeos compartidos: {invite.video1_hash || "?"} y {invite.video2_hash || "?"}</p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => handleDeclineInvite(invite.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Rechazar
                      </Button>
                      <Button
                        onClick={() => handleAcceptInvite(invite)}
                        disabled={inviteActionLoading === invite.id}
                      >
                        {inviteActionLoading === invite.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Aceptar"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}


