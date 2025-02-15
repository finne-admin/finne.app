"use client"

import { useState, useEffect } from "react"
import { VideoCard } from "@/components/ui/video-card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { WistiaModalNotification } from "@/components/wistia-modal/wistia-modal-notification"

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

export default function NotificationPage() {
    const [allVideos, setAllVideos] = useState<WistiaMedia[]>([])
    const [exercises, setExercises] = useState<WistiaMedia[]>([])
    const [selectedVideos, setSelectedVideos] = useState<string[]>([])
    const [currentStep, setCurrentStep] = useState<Step>("selection")
    const [showConfetti, setShowConfetti] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(3)

    const maxSelections = 2

    const selectedExerciseData = exercises.filter((ex) => selectedVideos.includes(String(ex.id)))

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/wistia")
                if (!res.ok) {
                    throw new Error("Failed to fetch Wistia data")
                }
                const data: WistiaMedia[] = await res.json()
                setAllVideos(data)
            } catch (err) {
                console.error("Error fetching Wistia data:", err)
                // Here you might want to set an error state and display it to the user
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (allVideos.length > 0) {
            setExercises(pickRandomThree(allVideos))
        }
    }, [allVideos])

    useEffect(() => {
        if (currentStep === "countdown") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setCurrentStep("video2")
                        return 3
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [currentStep])

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
        setCurrentStep("video1")
    }

    const handleVideoEnd = () => {
        console.log("Video ended, current step:", currentStep)
        if (currentStep === "video1") {
            setCurrentStep("countdown")
        } else if (currentStep === "video2") {
            setCurrentStep("satisfaction")
        }
    }

    const handleEmojiSelect = (emoji: string) => {
        setChosenEmoji(emoji)
        setShowConfetti(true)
        setCurrentStep("end")
    }

    const closeModal = () => {
        setCurrentStep("selection")
        setShowConfetti(false)
        setChosenEmoji(null)
        setSelectedVideos([])
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {showConfetti && <Confetti />}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Choose Your Exercises</h1>
                        <p className="mt-2 text-sm text-gray-600">Pick exactly two exercises to begin your session.</p>
                    </div>

                    {exercises.length === 0 ? (
                        <p className="text-center text-gray-500 mt-8">Loading exercises...</p>
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
                                    disabled={selectedVideos.length >= maxSelections && !selectedVideos.includes(String(ex.id))}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600" aria-live="polite">
                        <AlertCircle className="w-4 h-4" />
                        <span>
              {selectedVideos.length === maxSelections
                  ? "Great! You're ready to start."
                  : `Select ${maxSelections - selectedVideos.length} more exercises to continue.`}
            </span>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleStartExercise}
                            disabled={selectedVideos.length !== maxSelections}
                            className={cn(
                                "px-8 py-3 text-lg transition-all duration-200",
                                selectedVideos.length === maxSelections
                                    ? "bg-green-500 text-white hover:bg-green-600 transform hover:-translate-y-1"
                                    : "bg-gray-300 text-gray-700 cursor-not-allowed",
                            )}
                        >
                            Start Exercise
                        </Button>
                    </div>
                </div>
            </div>

            {currentStep === "video1" && selectedExerciseData[0] && (
                <WistiaModalNotification
                    hashedId={selectedExerciseData[0].hashed_id}
                    onClose={closeModal}
                    onVideoEnd={handleVideoEnd}
                />
            )}

            {currentStep === "countdown" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-lg text-center text-gray-900">
                        <h2 className="text-xl font-semibold mb-4">Short Break</h2>
                        <p className="text-lg font-medium">Rest for {countdown} seconds...</p>
                    </div>
                </div>
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
                    <div className="bg-white p-8 rounded-lg text-center text-gray-900">
                        <h2 className="text-xl font-semibold mb-4">How do you feel?</h2>
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
                    </div>
                </div>
            )}

            {currentStep === "end" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-xl font-semibold mb-4">Thank you!</h2>
                        {chosenEmoji && <p className="text-3xl mb-4">{chosenEmoji}</p>}
                        <p className="text-gray-600 mb-4">We appreciate your feedback.</p>
                        <Button onClick={closeModal}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    )
}