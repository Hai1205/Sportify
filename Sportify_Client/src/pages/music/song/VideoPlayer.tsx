import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  videoUrl: string;
  isPlaying: boolean;
};

export const VideoPlayer = ({ videoUrl, isPlaying }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audioElement = document.querySelector("audio");
    if (!audioElement || !videoRef.current) return;

    const syncTime = () => {
      if (
        videoRef.current &&
        Math.abs(videoRef.current.currentTime - audioElement.currentTime) > 0.5
      ) {
        videoRef.current.currentTime = audioElement.currentTime;
      }
    };

    const handlePlay = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current
          .play()
          .catch((err) => console.error("Cannot play video:", err));
      }
    };

    const handlePause = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    const preventInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("click", preventInteraction);
      video.addEventListener("dblclick", preventInteraction);
    }

    audioElement.addEventListener("timeupdate", syncTime);
    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);

    return () => {
      audioElement.removeEventListener("timeupdate", syncTime);
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);

      if (video) {
        video.removeEventListener("click", preventInteraction);
        video.removeEventListener("dblclick", preventInteraction);
      }
    };
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-6 relative">
      <div
        className="absolute inset-0 z-10"
        style={{ pointerEvents: "none" }}
      />

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto max-h-[400px]"
        muted={true}
        playsInline
        autoPlay={false}
        loop={false}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
        controlsList="nodownload noplaybackrate"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};