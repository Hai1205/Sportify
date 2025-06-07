import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SongTab } from "./components/SongTab"
import { SongVideoTab } from "./components/SongVideoTab"
import { SongLyricsTab } from "./components/SongLyricsTab"
// import { Song } from "@/components/album-tab"
// import { VideoTab } from "@/components/video-tab"
// import { LyricsTab } from "@/components/lyrics-tab"
// import { AudioControls } from "@/components/audio-controls"

// Sample song data - in a real app, this would come from an API or props
const sampleSong = {
  title: "Sample Song",
  artist: "Sample Artist",
  albumArt: "https://th.bing.com/th/id/OIP.5PFnktKdEc37NkEzNQO2RQHaJQ?rs=1&pid=ImgDetMain?height=300&width=300",
  audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
  lyrics: `[Verse 1]
This is the first verse of the sample song
These are the lyrics that would appear
Line by line as the song plays
The user can scroll through them

[Chorus]
This is the chorus of the sample song
It repeats several times throughout
The catchiest part of the track
That everyone remembers

[Verse 2]
This is the second verse with different words
Continuing the story or theme
Adding more depth to the meaning
Before returning to the chorus again

[Bridge]
This is the bridge section
Often with a different melody
Creating contrast in the song
Before the final chorus

[Chorus]
This is the chorus of the sample song
It repeats several times throughout
The catchiest part of the track
That everyone remembers`,
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)
  const [activeTab, setActiveTab] = useState("album")

  const audioRef = useRef<HTMLAudioElement>(null)

//   useEffect(() => {
//     const audio = audioRef.current
//     if (!audio) return

//     const updateTime = () => setCurrentTime(audio.currentTime)
//     const updateDuration = () => setDuration(audio.duration)
//     const handleEnded = () => setIsPlaying(false)

//     audio.addEventListener("timeupdate", updateTime)
//     audio.addEventListener("loadedmetadata", updateDuration)
//     audio.addEventListener("ended", handleEnded)

//     return () => {
//       audio.removeEventListener("timeupdate", updateTime)
//       audio.removeEventListener("loadedmetadata", updateDuration)
//       audio.removeEventListener("ended", handleEnded)
//     }
//   }, [])

//   const togglePlayPause = () => {
//     const audio = audioRef.current
//     if (!audio) return

//     if (isPlaying) {
//       audio.pause()
//     } else {
//       audio.play()
//     }
//     setIsPlaying(!isPlaying)
//   }

//   const handleTimeChange = (value: number) => {
//     const audio = audioRef.current
//     if (!audio) return

//     audio.currentTime = value
//     setCurrentTime(value)
//   }

//   const handleVolumeChange = (value: number) => {
//     const audio = audioRef.current
//     if (!audio) return

//     audio.volume = value
//     setVolume(value)
//   }

  return (
    <div className="h-full rounded-lg border border-accent bg-zinc-900 text-card-foreground shadow-lg overflow-hidden">
      <div className="p-4 border-b border-accent">
        <h2 className="text-2xl font-bold text-white">{sampleSong.title}</h2>
       
        <p className="text-muted-foreground">{sampleSong.artist}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-zinc-900">
        <TabsList className="grid grid-cols-3 w-full bg-zinc-900">
          <TabsTrigger
            value="album"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-zinc-900"
          >
            Album
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-zinc-900"
          >
            Video
          </TabsTrigger>
          <TabsTrigger
            value="lyrics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-zinc-900"
          >
            Lyrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="album" className="p-4 flex justify-center">
          <SongTab albumArt={sampleSong.albumArt} isPlaying={isPlaying} />
        </TabsContent>

        <TabsContent value="video" className="p-4 flex justify-center">
          <SongVideoTab videoSrc={sampleSong.videoSrc} isPlaying={isPlaying} currentTime={currentTime} />
        </TabsContent>

        <TabsContent value="lyrics" className="p-4">
          <SongLyricsTab lyrics={sampleSong.lyrics} />
        </TabsContent>
      </Tabs>

      <audio ref={audioRef} src={sampleSong.audioSrc} preload="metadata" />

      {/* <div className="p-4 border-t">
        <AudioControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onPlayPause={togglePlayPause}
          onTimeChange={handleTimeChange}
          onVolumeChange={handleVolumeChange}
        />
      </div> */}
    </div>
  )
}

export default MusicPlayer;