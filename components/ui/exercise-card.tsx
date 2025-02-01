"use client"

import { Heart, Play } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Asset {
    url: string
    width: number
    height: number
    type: string
}

interface ExerciseCardProps {
    title: string
    description: string
    duration: string
    assets: Asset[]
    hashedId?: string
    isFavorite?: boolean
    onPlay?: (hashedId?: string) => void
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

export function ExerciseCard({
                                 title,
                                 description,
                                 duration,
                                 assets,
                                 hashedId,
                                 isFavorite = false,
                                 onPlay,
                             }: Readonly<ExerciseCardProps>) {
    const [favorite, setFavorite] = useState(isFavorite)

    const thumbnail = useMemo(() => getBestThumbnail(assets, 640), [assets])

    return (
        <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                    src={thumbnail.url || "/placeholder.svg"}
                    alt={`${title} thumbnail`}
                    width={thumbnail.width}
                    height={thumbnail.height}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                <button
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Play ${title}`}
                    onClick={() => onPlay?.(hashedId)}
                >
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-gray-900 ml-1" />
                    </div>
                </button>

                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-sm">{duration}</div>

                <button
                    onClick={() => setFavorite(!favorite)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center transition-colors hover:bg-black/40"
                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart className={cn("w-4 h-4 transition-colors", favorite ? "fill-white text-white" : "text-white")} />
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    )
}