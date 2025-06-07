import { ScrollArea } from "@/components/ui/scroll-area"

interface LyricsTabProps {
  lyrics: string
}

export function SongLyricsTab({ lyrics }: LyricsTabProps) {
  // In a real app, you would sync the lyrics with the current time
  // This would require timestamps for each line of lyrics

  return (
    <ScrollArea className="w-full h-64 rounded-md">
      <div className="p-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">{lyrics}</pre>
      </div>
    </ScrollArea>
  )
}

