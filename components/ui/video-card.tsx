"use client"

import { useState, useMemo } from "react"
import { Heart, Play, Check } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface VideoCardProps {
    id: string
    title: string
    description: string
    duration: string
    assets: Asset[]
    hashedId?: string        // to play the Wistia video
    isSelected: boolean
    onSelect: (id: string) => void
    disabled?: boolean
}

interface Asset {
    url: string
    width: number
    height: number
    type: string
}

function getBestThumbnail(assets: Asset[], targetWidth: number): Asset {
    const stillImages = assets.filter((asset) => asset.type === "StillImageFile")
    return stillImages.reduce((best, current) => {
        if (best.width < targetWidth && current.width > best.width) {
            return current
        }
        if (best.width > targetWidth && current.width < best.width && current.width >= targetWidth) {
            return current
        }
        return best
    }, stillImages[0])
}

export function VideoCard({
                              id,
                              title,
                              description,
                              duration,
                              assets,
                              isSelected,
                              onSelect,
                              disabled = false,
                          }: Readonly<VideoCardProps>) {

    console.log(assets)

    const thumbnail = useMemo(() => getBestThumbnail(assets, 640), [assets])
    // Local "favorite" state (like ExerciseCard)
    const [favorite, setFavorite] = useState(false)

    // Handler for toggling favorite
    const handleToggleFavorite = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation() // Avoid also triggering onSelect
        if (!disabled) {
            setFavorite((prev) => !prev)
        }
    }

    // Handle user selection
    const handleSelect = () => {
        if (!disabled) onSelect(id)
    }

    return (
        <div
            className={cn(
                "group relative bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {/* If only one thumbnail, we just render it directly */}
                <Image
                    src={thumbnail.url || "/placeholder.svg"}
                    alt={`${title} thumbnail`}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                {/* Big "Play" button overlay (only decorative unless you wire an onClick) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-gray-900 ml-1" />
                    </div>
                </div>

                {/* Duration badge (bottom-right) */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-sm">
                    {duration}
                </div>

                {/* Favorite (heart) button (top-right) */}
                <button
                    onClick={handleToggleFavorite}
                    disabled={disabled}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center transition-colors hover:bg-black/40"
                    aria-label={
                        favorite ? "Remove from favorites" : "Add to favorites"
                    }
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-colors",
                            favorite ? "fill-white text-white" : "text-white"
                        )}
                    />
                </button>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{description}</p>

                {/* Selection Button (like "Select Video" or "Selected") */}
                <button
                    onClick={handleSelect}
                    disabled={disabled}
                    className={cn(
                        "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2",
                        isSelected
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                >
                    {isSelected ? (
                        <>
                            <Check className="w-4 h-4" />
                            Selected
                        </>
                    ) : (
                        "Select Video"
                    )}
                </button>
            </div>
        </div>
    )
}