import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Album, Song } from "@/utils/types";
import LoadingSpinner from "@/components/ui/loading";
import { Clock, Disc, Save, Trash, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMusicStore } from "@/stores/useMusicStore";
import AddSongToAlbumDialog from "./AddSongToAlbumDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatTime } from "@/lib/utils";

type UploadAlbumDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAlbumUploaded: (updatedAlbum: Album) => void;
};

const UploadAlbumDialog = ({
  isOpen,
  onOpenChange,
  onAlbumUploaded,
}: UploadAlbumDialogProps) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [albumData, setAlbumData] = useState({
    title: "",
  });
  const [isAddSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  const { uploadAlbum } = useMusicStore();
  const { user: userAuth } = useAuthStore();

  const handleChange = (field: keyof typeof albumData, value: string) => {
    setAlbumData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadAlbum = async () => {
    if (!userAuth) {
      return;
    }

    const formData = new FormData();
    formData.append("title", albumData.title || "");
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    const songIds = songs.map((song) => song.id);
    formData.append("songIds", JSON.stringify(songIds));

    setIsLoading(true);
    const res = await uploadAlbum(userAuth?.id, formData);
    setIsLoading(false);

    if (!res) {
      return;
    }

    onAlbumUploaded(res);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setThumbnail(null);
    setSongs([]);
    setAlbumData({
      title: "",
    });
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleOpenAddSongDialog = () => {
    setAddSongDialogOpen(true);
  };

  const changeSongs = (song: Song, isAdding: boolean) => {
    setSongs((prevSongs) => {
      if (isAdding) {
        return [...prevSongs, song];
      } else {
        return prevSongs.filter((s) => s.id !== song.id);
      }
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Upload A New Album
                </Dialog.Title>

                <ScrollArea className="max-h-[70vh] mt-4">
                  <div className="grid gap-4 py-4 px-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-full h-40 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-[#282828]">
                          <Avatar className="rounded-md object-cover w-full h-full">
                            <AvatarImage
                              src={
                                thumbnail
                                  ? URL.createObjectURL(thumbnail)
                                  : "/placeholder.svg"
                              }
                              alt={thumbnail?.name || ""}
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
                              onClick={() =>
                                document
                                  .getElementById("thumbnail-input")
                                  ?.click()
                              }
                            >
                              Change
                            </Button>

                            <input
                              id="thumbnail-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailChange}
                            />
                          </div>
                        </div>
                      </div>

                      <Label htmlFor="edit-album-title" className="text-white">
                        Album Title
                      </Label>

                      <Input
                        id="edit-album-title"
                        value={albumData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="bg-[#282828] text-white border-gray-700 focus:border-[#1DB954] focus:ring-[#1DB954]"
                      />
                      <Button
                        onClick={handleOpenAddSongDialog}
                        className="mt-2 bg-[#1DB954] text-white hover:bg-[#1ed760]"
                      >
                        <Plus className="h-4 w-4" />
                        Add Song
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Song</TableHead>

                          <TableHead className="text-center">Views</TableHead>

                          <TableHead className="text-center">
                            Duration
                          </TableHead>

                          <TableHead className="text-center">
                            Release Date
                          </TableHead>

                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {songs.length > 0 ? (
                          songs.map((song) => (
                            <TableRow key={song.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex justify-center">
                                    <Avatar className="h-9 w-9 rounded-md">
                                      <AvatarImage
                                        src={song.thumbnailUrl}
                                        alt={song.title}
                                      />

                                      <AvatarFallback>
                                        <Disc className="h-4 w-4" />
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>

                                  <div>
                                    <div className={`font-medium text-white`}>
                                      {song.title}
                                    </div>

                                    <div className={`text-sm text-zinc-400`}>
                                      {song?.user?.fullName}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                {song.views}
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span>{formatTime(song.duration)}</span>
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                {song.releaseDate}
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center justify-end">
                                  <Trash
                                    className="mr-2 h-4 w-4 text-red-600 hover:text-red-800 transition-colors duration-200 cursor-pointer"
                                    onClick={() => changeSongs(song, false)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              Album has no songs.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-700 text-white hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleUploadAlbum}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>

                <AddSongToAlbumDialog
                  isOpen={isAddSongDialogOpen}
                  onOpenChange={setAddSongDialogOpen}
                  setSongs={setSongs}
                  userAuth={userAuth}
                  songs={songs}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UploadAlbumDialog;
