"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SongTabProps {
  albumArt: string
  isPlaying: boolean
}

export function SongTab({ albumArt, isPlaying }: SongTabProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    let animationFrame: number

    const rotate = () => {
      setRotation((prev) => (prev + 0.1) % 360)
      animationFrame = requestAnimationFrame(rotate)
    }

    if (isPlaying) {
      animationFrame = requestAnimationFrame(rotate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Vinyl record effect */}
      <div className="absolute w-full h-full rounded-full bg-black opacity-80"></div>

      {/* Album art */}
      <div
        className={cn(
          "w-full h-full rounded-full overflow-hidden border-8 border-black transition-transform duration-500",
          isPlaying ? "shadow-lg shadow-primary/20" : "",
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img src={albumArt || "/placeholder.svg"} alt="Album Cover" className="w-full h-full object-cover" />
      </div>

      {/* Center hole */}
      <div className="absolute w-10 h-10 rounded-full bg-black border-4 border-accent z-10"></div>
    </div>
  )
}

