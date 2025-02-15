"use client"

import { useState, useEffect, useRef } from "react"
import { VideoCard } from "@/components/ui/video-card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import {WistiaModal} from "@/components/wistia-modal/wistia-modal";

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

export default function NotificationPage() {
    // All videos from Wistia
    const [allVideos, setAllVideos] = useState<WistiaMedia[]>([])
    // Our 3 random picks
    const [exercises, setExercises] = useState<WistiaMedia[]>([])
    const [selectedVideos, setSelectedVideos] = useState<string[]>([])
    const maxSelections = 2

    // Steps for the multi-step process
    const [currentStep, setCurrentStep] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState<string | null>(null)

    // 3-second break countdown
    const [countdown, setCountdown] = useState(3)
    const [isCountingDown, setIsCountingDown] = useState(false)

    // The data for the 2 selected items
    const selectedExerciseData = exercises.filter((ex) =>
        selectedVideos.includes(String(ex.id))
    )

    // Fetch Wistia data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/wistia")
                const data: WistiaMedia[] = await res.json()
                setAllVideos(data)
            } catch (err) {
                console.error("Error fetching Wistia data", err)
            }
        }
        fetchData()
    }, [])

    // Once we have allVideos, pick random 3
    useEffect(() => {
        if (allVideos.length > 0) {
            setExercises(pickRandomThree(allVideos))
        }
    }, [allVideos])

    // Start break countdown on step=1
    useEffect(() => {
        if (currentStep === 1) {
            setCountdown(3)
            setIsCountingDown(true)
        } else {
            setIsCountingDown(false)
        }
    }, [currentStep])

    // Decrement countdown each second if counting down
    useEffect(() => {
        if (!isCountingDown) return
        if (countdown <= 0) {
            setCurrentStep(2)
            return
        }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [isCountingDown, countdown])

    const handleVideoSelect = (strId: string) => {
        setSelectedVideos((prev) => {
            if (prev.includes(strId)) {
                return prev.filter((id) => id !== strId)
            }
            if (prev.length >= maxSelections) {
                return prev
            }
            return [...prev, strId]
        })
    }

    const handleStartExercise = () => {
        setCurrentStep(0)
        setShowModal(true)
    }

    const goToNextStep = () => {
        if (currentStep < 4) setCurrentStep((s) => s + 1)
    }

    const handleEmojiSelect = (emoji: string) => {
        setChosenEmoji(emoji)
        setShowConfetti(true)
        setCurrentStep(4)
    }

    const closeModal = () => {
        setShowModal(false)
        setCurrentStep(0)
        setShowConfetti(false)
        setChosenEmoji(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {showConfetti && <Confetti />}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                            Choose Your Exercises
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Pick exactly two exercises to begin your session.
                        </p>
                    </div>

                    {/* If no exercises found */}
                    {exercises.length === 0 ? (
                        <p className="text-center text-gray-500 mt-8">
                            Loading or no exercises available...
                        </p>
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
                                        selectedVideos.length >= maxSelections &&
                                        !selectedVideos.includes(String(ex.id))
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Selection Info */}
                    <div
                        className="flex items-center justify-center gap-2 text-sm text-gray-600"
                        aria-live="polite"
                    >
                        <AlertCircle className="w-4 h-4" />
                        <span>
              {selectedVideos.length === maxSelections
                  ? "Great! You're ready to start."
                  : (() => {
                      const remain = maxSelections - selectedVideos.length
                      const label = remain === 1 ? "exercise" : "exercises"
                      return `Select ${remain} more ${label} to continue.`
                  })()}
            </span>
                    </div>

                    {/* Start Button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handleStartExercise}
                            disabled={selectedVideos.length !== maxSelections}
                            className={cn(
                                "px-8 py-3 text-lg transition-all duration-200",
                                selectedVideos.length === maxSelections
                                    ? "bg-green-500 text-white hover:bg-green-600 transform hover:-translate-y-1"
                                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                            )}
                        >
                            Start Exercise
                        </Button>
                    </div>
                </div>
            </div>

            {/* Multi-step Modal */}
            {showModal && (
                <NotificationMultiStepModal
                    onClose={closeModal}
                    currentStep={currentStep}
                    goToNextStep={goToNextStep}
                    countdown={countdown}
                    selectedExerciseData={selectedExerciseData}
                    chosenEmoji={chosenEmoji}
                    handleEmojiSelect={handleEmojiSelect}
                />
            )}
        </div>
    )
}

export function NotificationMultiStepModal({
                                               onClose,
                                               currentStep,
                                               goToNextStep,
                                               countdown,
                                               selectedExerciseData,
                                               chosenEmoji,
                                               handleEmojiSelect,
                                           }: {
    onClose: () => void
    currentStep: number
    goToNextStep: () => void
    countdown: number
    selectedExerciseData: WistiaMedia[]
    chosenEmoji: string | null
    handleEmojiSelect: (emoji: string) => void
}) {
    const modalRef = useRef<HTMLDivElement>(null)

    // For controlling the Wistia video modal
    const [showWistiaModal, setShowWistiaModal] = useState(false)
    const [currentHashedId, setCurrentHashedId] = useState<string | null>(null)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }
        document.addEventListener("keydown", handleEscape)
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    // A helper to open the Wistia video
    function openWistiaVideo(hashedId: string) {
        setCurrentHashedId(hashedId)
        setShowWistiaModal(true)
    }

    // Closes the Wistia video
    function closeWistiaVideo() {
        setShowWistiaModal(false)
        setCurrentHashedId(null)
    }

    function renderStep() {
        // Step 0 => first video
        if (currentStep === 0) {
            const [video1] = selectedExerciseData
            if (!video1) return <p>No first video found</p>
            return (
                <StepWrapper title={`Now Playing: ${video1.name}`}>
                    <p className="text-sm text-gray-600 mb-4">
                        Click below to watch this exercise.
                    </p>
                    <Button onClick={() => openWistiaVideo(video1.hashed_id)}>
                        Play Video
                    </Button>

                    <Button onClick={goToNextStep} variant="outline" className="mt-4">
                        Next
                    </Button>
                </StepWrapper>
            )
        }

        // Step 1 => break
        if (currentStep === 1) {
            return (
                <StepWrapper title="Short Break">
                    <p className="text-center text-lg font-medium">
                        Rest for {countdown} seconds...
                    </p>
                </StepWrapper>
            )
        }

        // Step 2 => second video
        if (currentStep === 2) {
            const video2 = selectedExerciseData[1]
            if (!video2) return <p>No second video found</p>
            return (
                <StepWrapper title={`Now Playing: ${video2.name}`}>
                    <p className="text-sm text-gray-600 mb-4">
                        Click below to watch this exercise.
                    </p>
                    <Button onClick={() => openWistiaVideo(video2.hashed_id)}>
                        Play Video
                    </Button>

                    <Button onClick={goToNextStep} variant="outline" className="mt-4">
                        Next
                    </Button>
                </StepWrapper>
            )
        }

        // Step 3 => satisfaction
        if (currentStep === 3) {
            return (
                <StepWrapper title="How do you feel?">
                    <p className="text-gray-600 text-sm">
                        Rate your satisfaction after completing these exercises.
                    </p>
                    <div className="flex justify-center gap-3 text-3xl mt-4">
                        {["😟", "😐", "🙂", "😀", "🤩"].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleEmojiSelect(emoji)}
                                className="hover:scale-125 transition-transform"
                                aria-label={`Choose emoji ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </StepWrapper>
            )
        }

        // Step 4 => done
        if (currentStep === 4) {
            return (
                <StepWrapper title="Thank you!">
                    {chosenEmoji && <p className="text-lg">You chose: {chosenEmoji}</p>}
                    <p className="text-gray-600 mt-2">We appreciate your feedback.</p>
                    <Button onClick={onClose} className="mt-4">
                        Close
                    </Button>
                </StepWrapper>
            )
        }

        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div
                ref={modalRef}
                className="relative z-10 w-full max-w-3xl bg-white rounded-md p-6 shadow-lg"
            >
                {/* Close entire multi-step flow */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                >
                    &times;
                </button>

                <div className="mt-8">{renderStep()}</div>
            </div>

            {/* Here is the WistiaModal */}
            {showWistiaModal && currentHashedId && (
                <WistiaModal hashedId={currentHashedId} onClose={closeWistiaVideo} />
            )}
        </div>
    )
}

function StepWrapper({
                         title,
                         children,
                     }: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    )
}