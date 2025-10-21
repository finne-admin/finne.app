"use client"

import { useState, useEffect } from "react"
import { VideoCard } from "@/components/ui/video-card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { WistiaModalNotification } from "@/components/wistia-modal/wistia-modal-notification"
import { Skeleton } from "@/components/ui/skeleton";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { checkAchievements } from '@/lib/achievements';
import { checkWeeklyChallenges } from '@/lib/checkWeeklyChallenges';
import StreakPopup from '@/components/animations/StreakPopup'
import CategoryCountsPopover from '@/components/utils/CategoryCountsPopover'
import { getVideoExp } from '@/lib/experience'

// 👉 NUEVO: hook + barra con etiquetas de PA
import { useDailyQuota, DailyQuotaBar } from "@/components/utils/DailyQuotaBar"

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

function pickRandomThree<T>(arr: T[]): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

type Step = "selection" | "video1" | "countdown" | "video2" | "satisfaction" | "end"
const supabase = createClientComponentClient()

export default function NotificationPage() {
  const [allVideos, setAllVideos] = useState<WistiaMedia[]>([])
  const [exercises, setExercises] = useState<WistiaMedia[]>([])
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<Step>("selection")
  const [showConfetti, setShowConfetti] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // Celebración de racha
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  const [streakHit, setStreakHit] = useState<number | null>(null)

  const closeStreakCelebration = () => {
    setShowStreakCelebration(false)
    setStreakHit(null)
    setShowConfetti(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  // 👉 NUEVO: límite con recompensa + puntos por pausa
  const DAILY_LIMIT = 3
  const POINTS_PER_PAUSE = 20 // 2 vídeos x 10 PA

  const {
    usedToday,
    remainingToday,
    loadingQuota,
    quotaError,
    refetchQuota
  } = useDailyQuota(DAILY_LIMIT, 'active_pauses')

  const maxSelections = 2
  const selectedExerciseData = exercises.filter((ex) => selectedVideos.includes(String(ex.id)))

  const saveSatisfactionData = async (level: number) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const videoHashes = selectedExerciseData.map(ex => ex.hashed_id);

      const tagsResponse = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_hashes: videoHashes })
      });

      if (!tagsResponse.ok) {
        const errorData = await tagsResponse.json();
        throw new Error(errorData.error || 'Error al obtener etiquetas');
      }

      const { tags, errors } = await tagsResponse.json();
      if (errors?.length) console.warn('Errores parciales al obtener etiquetas:', errors);

      const { error } = await supabase
        .from('exercise_satisfaction')
        .insert([{
          user_id: user?.id ?? null,
          video_hash_ids: videoHashes,
          satisfaction_level: level,
          tags: tags
        }]);

      if (error) throw error;
    } catch (err: any) {
      setSubmitError(err.message || 'Error al guardar comentarios');
      console.error('Error de envío:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/wistia")
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
    if (allVideos.length > 0) {
      setExercises(pickRandomThree(allVideos))
    }
  }, [allVideos])

  useEffect(() => {
    if (currentStep === "countdown") {
      setProgress(100)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCurrentStep("video2")
            return 3
          }
          const newCount = prev - 1
          setProgress((newCount / 3) * 100)
          return newCount
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentStep])

  const handleVideoSelect = (strId: string) => {
    setSelectedVideos((prev) => {
      if (prev.includes(strId)) return prev.filter((id) => id !== strId)
      if (prev.length >= maxSelections) return prev
      return [...prev, strId]
    })
  }

  const handleSkipCountdown = () => setCurrentStep("video2")

  const handleStartExercise = () => {
    setIsStarting(true)
    setCurrentStep("video1")
  }

  const handleVideoEnd = () => {
    if (currentStep === "video1") {
      setCurrentStep("countdown");
    } else if (currentStep === "video2") {
      setCurrentStep("satisfaction");
      void handlePostVideoLogic();
    }
    setIsStarting(false);
  };

  const handlePostVideoLogic = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return

    const wistiaIds = selectedExerciseData.map((ex) => ex.hashed_id)
    const { data: videoRows, error: videoError } = await supabase
      .from('videos')
      .select('id, wistia_id')
      .in('wistia_id', wistiaIds)

    if (videoError || !videoRows || videoRows.length !== 2) {
      console.error('Error obteniendo IDs de vídeos:', videoError)
      return
    }

    const [video1, video2] = wistiaIds.map(id => videoRows.find(v => v.wistia_id === id)!)

    const { error: insertError } = await supabase
      .from('active_pauses')
      .insert({
        user_id: user.id,
        video1_id: video1.id,
        video2_id: video2.id,
      })

    if (insertError) {
      console.error('Error al insertar active_pause:', insertError)
      return;
    }

    // Sumar EXP por los dos vídeos (10 PA c/u -> 20 PA por pausa)
    try {
      const totalExp = selectedExerciseData.reduce((acc, ex) => {
        const sec = Math.round(ex.duration || 0)
        return acc + getVideoExp(sec)
      }, 0)

      if (totalExp > 0) {
        const meta = {
          video1_id: video1.id,
          video2_id: video2.id,
          wistia_ids: selectedExerciseData.map(v => v.hashed_id)
        }
        const { error: rpcErr } = await supabase.rpc('add_pause_exp', {
          _user: user.id,
          _points: totalExp,
          _meta: meta
        })
        if (rpcErr) console.error('add_pause_exp error:', rpcErr)
      }
    } catch (e) {
      console.error('Error calculando/sumando EXP de pausa activa:', e)
    }

    // refrescar cupo tras insertar
    await refetchQuota()

    // Animación de racha
    try {
      const { data: celebrateRes, error: rpcError } = await supabase
        .rpc('celebrate_streak', { p_org: null })
      if (!rpcError && celebrateRes?.[0]?.celebrate) {
        const streak = celebrateRes[0].streak as number
        setStreakHit(streak)
        setShowStreakCelebration(true)
        setShowConfetti(true)
      }
    } catch (e) {
      console.warn('celebrate_streak call failed:', e)
    }

    await checkWeeklyChallenges(user.id, 'active_pause_inserted', {
      created_at: new Date().toISOString(),
      video1_id: video1.id,
      video2_id: video2.id,
    });

    await checkAchievements(user.id, 'pausas_en_dia')
    await checkAchievements(user.id, 'pausas_semana')
    await checkAchievements(user.id, 'mejora_semanal')
    await checkAchievements(user.id, 'dias_consecutivos_con_pausa')
    await checkAchievements(user.id, 'recupera_racha')
    await checkAchievements(user.id, 'max_dias_sin_pausa')
    await checkAchievements(user.id, 'dias_completos')
    await checkAchievements(user.id, 'dias_laborales_con_pausa')
    await checkAchievements(user.id, 'ejercicios_brazos')
    await checkAchievements(user.id, 'ejercicios_piernas')
    await checkAchievements(user.id, 'ejercicios_core')
    await checkAchievements(user.id, 'ejercicios_movilidad')
    await checkAchievements(user.id, 'circuito_completo')
  }

  const handleEmojiSelect = async (emoji: string) => {
    const levels = ["😟", "😐", "🙂", "😀", "🤩"]
    const level = levels.indexOf(emoji) + 1
    await saveSatisfactionData(level)
    setChosenEmoji(emoji); setShowConfetti(true); setCurrentStep("end")
  }

  const closeModal = () => {
    setCurrentStep("selection")
    setShowConfetti(false)
    setChosenEmoji(null)
    setSelectedVideos([])
    setIsStarting(false)
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (<Skeleton key={i} className="aspect-video rounded-xl" />))}
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Elige tus Ejercicios
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Selecciona exactamente dos ejercicios para comenzar tu sesión
            </p>

            {/* 👉 NUEVO: barra de cupo diario con etiquetas +PA por segmento */}
            <DailyQuotaBar
            limit={DAILY_LIMIT}
            usedToday={usedToday}
            loading={loadingQuota}
            error={quotaError}
            pointsPerPause={POINTS_PER_PAUSE}
            unitLabel="AP"   // 👈 mismo texto que en tus círculos
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((ex) => (
                <VideoCard
                  key={ex.id}
                  id={String(ex.id)}
                  title={ex.name}
                  description={ex.description.replace(/<[^>]+>/g, "")}
                  duration={`${Math.round(ex.duration)}s`}
                  assets={ex.assets}
                  isSelected={selectedVideos.includes(String(ex.id))}
                  onSelect={handleVideoSelect}
                  disabled={
                    (selectedVideos.length >= maxSelections && !selectedVideos.includes(String(ex.id))) ||
                    remainingToday <= 0
                  }
                  // ⬇️ Eliminamos el badge de PA por vídeo
                  // badge={`(+${getVideoExp(Math.round(ex.duration || 0))} PA)`}
                />
              ))}
            </div>
          )}

          {/* Selection Status */}
          {!isLoading && !error && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {selectedVideos.length === maxSelections
                  ? "¡Genial! Estás listo para empezar."
                  : `Selecciona ${maxSelections - selectedVideos.length} más para continuar`}
              </span>
            </div>
          )}

          {/* Start Button */}
          {!isLoading && !error && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleStartExercise}
                  disabled={
                    selectedVideos.length !== maxSelections ||
                    isStarting ||
                    remainingToday <= 0
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
                  {isStarting
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : remainingToday <= 0
                      ? "Límite diario alcanzado"
                      : "Iniciar Ejercicios"}
                </Button>

                <CategoryCountsPopover />
              </div>
            </div>
          )}

          {!isLoading && !error && remainingToday <= 0 && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Has llegado al máximo de {DAILY_LIMIT} pausas con recompensa. ¡Puedes seguir entrenando sin XP!
            </p>
          )}
        </div>
      </div>

      {/* Modals and Overlays */}
      {currentStep === "video1" && selectedExerciseData[0] && (
        <WistiaModalNotification
          hashedId={selectedExerciseData[0].hashed_id}
          onClose={closeModal}
          onVideoEnd={handleVideoEnd}
          isLoading={!selectedExerciseData[0].assets?.length}
        />
      )}

      {currentStep === "countdown" && (
        <CountdownTimer countdown={countdown} totalTime={countdown} onSkip={handleSkipCountdown} />
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
            <h2 className="text-2xl font-bold mb-4">¿Cómo te has sentido con el ejercicio?</h2>

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
            <p className="text-gray-600 mb-4">Agradecemos tu valoración.</p>
            <Button onClick={closeModal}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  )
}
