'use client'

import { useState } from 'react'
import { VideoCard } from '@/components/ui/video-card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const exercises = [
    {
        id: '1',
        title: 'Seated Stretch',
        description: 'A gentle seated stretch to relieve tension in your back and shoulders.',
        duration: '30s',
        thumbnail: '/placeholder.svg?height=200&width=300'
    },
    {
        id: '2',
        title: 'Neck Relaxer',
        description: 'Relax your neck muscles and reduce stiffness with these simple rotations.',
        duration: '40s',
        thumbnail: '/placeholder.svg?height=200&width=300'
    },
    {
        id: '3',
        title: 'Desk Push-ups',
        description: 'Strengthen your arms and chest with this quick push-up variation using your desk.',
        duration: '40s',
        thumbnail: '/placeholder.svg?height=200&width=300'
    }
]

export default function NotificationPage() {
    const [selectedVideos, setSelectedVideos] = useState<string[]>([])
    const maxSelections = 2

    const handleVideoSelect = (id: string) => {
        setSelectedVideos(prev => {
            if (prev.includes(id)) {
                return prev.filter(videoId => videoId !== id)
            }
            if (prev.length >= maxSelections) {
                return prev
            }
            return [...prev, id]
        })
    }

    const handleStartExercise = () => {
        console.log('Starting exercise with videos:', selectedVideos)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                            Choose Your Exercises
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Select two exercises to begin your session
                        </p>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((exercise) => (
                            <VideoCard
                                key={exercise.id}
                                {...exercise}
                                isSelected={selectedVideos.includes(exercise.id)}
                                onSelect={handleVideoSelect}
                                disabled={selectedVideos.length >= maxSelections && !selectedVideos.includes(exercise.id)}
                            />
                        ))}
                    </div>

                    {/* Selection Info */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>
              {selectedVideos.length === maxSelections
                  ? "Great! You're ready to start."
                  : `Select ${maxSelections - selectedVideos.length} more ${
                      maxSelections - selectedVideos.length === 1 ? 'exercise' : 'exercises'
                  } to continue.`}
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
                                    ? "bg-[#8BC5B5] hover:bg-[#7AB4A4] transform hover:-translate-y-1"
                                    : "bg-gray-300"
                            )}
                        >
                            Start Exercise
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}