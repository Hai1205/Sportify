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
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/ui/loading";
import { Disc, Upload } from "lucide-react";

interface UploadAlbumTabProps {
  albumData: { title: string };
  setAlbumData: React.Dispatch<
    React.SetStateAction<{ title: string }>
  >;
  albumThumbnail: File | null;
  setAlbumThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
  handleUploadAlbum: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const UploadAlbumTab: React.FC<UploadAlbumTabProps> = ({
  albumData,
  setAlbumData,
  albumThumbnail,
  setAlbumThumbnail,
  handleUploadAlbum,
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
    <TabsContent value="album">
      <ScrollArea className="h-[400px] w-full border border-[#444444] rounded-md">
        <Card className="bg-[#252525] border-[#333333] shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#1DB954]">Upload a New Album</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details to upload your album
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUploadAlbum} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="album-thumbnail">Thumbnail</Label>
                <div className="relative w-full max-w-[50%] mx-auto h-60 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-[#282828]">
                  <Avatar className="rounded-md object-cover w-full h-full">
                    <AvatarImage
                      src={
                        albumThumbnail
                          ? URL.createObjectURL(albumThumbnail)
                          : "/placeholder.svg"
                      }
                      alt={albumData.title}
                      className="rounded-none"
                    />
                    <AvatarFallback className="absolute inset-0 flex items-center justify-center text-8xl font-bold !rounded-none">
                      <Disc className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("thumbnail-input")?.click();
                      }}
                    >
                      Change
                    </Button>

                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setAlbumThumbnail)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="album-title">Title</Label>

                <Input
                  id="album-title"
                  placeholder="Enter album title"
                  value={albumData.title}
                  onChange={(e) =>
                    setAlbumData({ ...albumData, title: e.target.value })
                  }
                  className="bg-[#333333] border-[#444444] focus-visible:ring-[#1DB954] transition-colors duration-200"
                />
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
                    Upload
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

export default UploadAlbumTab;
