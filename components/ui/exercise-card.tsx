'use client'

import { Heart, Play } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from "next/image";

interface ExerciseCardProps {
  title: string
  description: string
  duration: string
  thumbnail: string
  isFavorite?: boolean
}

export function ExerciseCard({
  title,
  description,
  duration,
  thumbnail,
  isFavorite = false,
}: Readonly<ExerciseCardProps>) {
  const [favorite, setFavorite] = useState(isFavorite)

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <Image
            src={thumbnail}
            alt={title}
            layout="fill"
            objectFit="cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        
        {/* Play Button */}
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-gray-900 ml-1" />
          </div>
        </button>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-sm">
          {duration}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center transition-colors hover:bg-black/40"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-white text-white" : "text-white"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

