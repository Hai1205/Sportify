"use client"

import { useRef, useEffect } from "react"

interface VideoTabProps {
  videoSrc: string
  isPlaying: boolean
  currentTime: number
}

export function SongVideoTab({ videoSrc, isPlaying, currentTime }: VideoTabProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Video playback failed:", error)
      })
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Sync video time with audio time
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime
    }
  }, [currentTime])

  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-auto"
        muted // Muted because we're using the audio element for sound
        playsInline
      />
    </div>
  )
}

