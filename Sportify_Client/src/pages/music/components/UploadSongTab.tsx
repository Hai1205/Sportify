import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileAudio, Music, Upload, Video } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/ui/loading";

interface UploadSongTabProps {
  songData: { title: string; lyrics: string };
  setSongData: React.Dispatch<
    React.SetStateAction<{ title: string; lyrics: string }>
  >;
  songThumbnail: File | null;
  setSongThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
  songVideo: File | null;
  setSongVideo: React.Dispatch<React.SetStateAction<File | null>>;
  songAudio: File | null;
  setSongAudio: React.Dispatch<React.SetStateAction<File | null>>;
  handleUploadSong: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const UploadSongTab: React.FC<UploadSongTabProps> = ({
  songData,
  setSongData,
  songThumbnail,
  setSongThumbnail,
  songVideo,
  setSongVideo,
  songAudio,
  setSongAudio,
  handleUploadSong,
  isLoading,
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <TabsContent value="song">
      <ScrollArea className="h-[400px] w-full border border-[#444444] rounded-md">
        <Card className="bg-[#252525] border-[#333333] shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#1DB954]">Upload a New Song</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details to upload your song
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUploadSong} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="song-thumbnail">Thumbnail</Label>
                <div className="relative w-full max-w-[50%] mx-auto h-60 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-[#282828]">
                  <Avatar className="rounded-md object-cover w-full h-full">
                    <AvatarImage
                      src={
                        songThumbnail
                          ? URL.createObjectURL(songThumbnail)
                          : "/placeholder.svg"
                      }
                      alt={songData.title}
                      className="rounded-none"
                    />
                    <AvatarFallback className="absolute inset-0 flex items-center justify-center text-8xl font-bold !rounded-none">
                      <Music className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
                      onClick={() =>
                        document.getElementById("thumbnail-input")?.click()
                      }
                    >
                      Change
                    </Button>

                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setSongThumbnail)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-title">Title</Label>
                <Input
                  id="song-title"
                  placeholder="Enter song title"
                  value={songData.title}
                  onChange={(e) =>
                    setSongData({ ...songData, title: e.target.value })
                  }
                  className="bg-[#333333] border-[#444444] focus-visible:ring-[#1DB954] transition-colors duration-200"
                />
              </div>

              <div className="flex space-x-4">
                <div className="space-y-2 w-full">
                  <Label htmlFor="song-video">Video File</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-[#333333] border-[#444444] hover:bg-[#444444] text-white transition-colors duration-200 relative w-full"
                      onClick={() =>
                        document.getElementById("song-video")?.click()
                      }
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {songVideo ? songVideo.name : "Upload Video"}
                    </Button>
                    <Input
                      id="song-video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, setSongVideo)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="song-audio">Audio File</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-[#333333] border-[#444444] hover:bg-[#444444] text-white transition-colors duration-200 relative w-full"
                      onClick={() =>
                        document.getElementById("song-audio")?.click()
                      }
                    >
                      <FileAudio className="mr-2 h-4 w-4" />
                      {songAudio ? songAudio.name : "Upload Audio"}
                    </Button>
                    <Input
                      id="song-audio"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, setSongAudio)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-lyrics">Lyrics</Label>

                <ScrollArea className="h-40 rounded-md border border-[#444444] bg-[#333333] p-4">
                  <Textarea
                    id="song-lyrics"
                    placeholder="Enter song lyrics"
                    value={songData.lyrics}
                    onChange={(e) =>
                      setSongData({ ...songData, lyrics: e.target.value })
                    }
                    className="bg-transparent border-0 focus-visible:ring-0 resize-none h-48"
                  />
                </ScrollArea>
              </div>

              <Button
                type="submit"
                className="w-1/4 mx-auto bg-[#1DB954] hover:bg-[#1ed760] text-white transition-colors duration-200 py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Song
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};

export default UploadSongTab;
