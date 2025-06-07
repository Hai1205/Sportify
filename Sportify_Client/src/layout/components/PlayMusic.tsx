import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Song } from "@/utils/types";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface PlayMusicProps {
  song: Song;
  size?: "default" | "sm" | "lg" | "icon";
}

const PlayMusic = ({ song, size = "sm" }: PlayMusicProps) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <Button
      size={size}
      onClick={handlePlay}
      className="bg-[#1DB954] text-white hover:bg-[#1ed760] transition-all"
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayMusic;
