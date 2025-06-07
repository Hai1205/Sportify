import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music, Search } from "lucide-react";
import { Album, Song, User } from "@/utils/types";
import { useMusicStore } from "@/stores/useMusicStore";

interface AddToAlbumDialogProps {
  isOpen: boolean;
  album?: Album | null;
  songs?: Song[] | null;
  userAuth?: User | null;
  onOpenChange: (open: boolean) => void;
  setSongs: (song: Song[]) => void;
}

const AddSongToAlbumDialog = ({
  isOpen,
  onOpenChange,
  setSongs,
  album,
  songs,
  userAuth,
}: AddToAlbumDialogProps) => {
  const { getUserSongs } = useMusicStore();
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchSongs = async () => {
      const songsFromAlbum = album?.user?.id
        ? await getUserSongs(album.user.id)
        : [];

      const songsFromUser = userAuth?.songs || [];

      const combinedSongs = [...songsFromAlbum, ...songsFromUser];

      setUserSongs(combinedSongs);

      setSelectedPlaylists(songs?.map((song) => song.id) || []);
    };

    fetchSongs();
  }, [album, getUserSongs, songs, userAuth]);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedPlaylists([]);
  };

  const handleAddToAlbum = () => {
    setSongs(
      selectedPlaylists
        .map((songId) => userSongs.find((song) => song.id === songId))
        .filter((song): song is Song => song !== undefined)
    );
    handleClose();
  };

  const filteredSongs = userSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Add song
                </Dialog.Title>

                <div className="grid gap-4 py-4">
                  {album && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-md bg-[#282828]">
                        <AvatarImage
                          src={album?.thumbnailUrl || ""}
                          alt={album?.title || ""}
                        />
                        <AvatarFallback className="bg-[#282828]">
                          <Music className="h-5 w-5 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">
                          {album?.title || ""}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {album?.user?.fullName || ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search songs..."
                      className="pl-8 bg-[#282828] text-white border-gray-700 focus:border-[#1DB954] focus:ring-[#1DB954]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-white">
                      Your Songs
                    </h3>
                  </div>

                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-[#282828] transition-colors"
                        >
                          <label
                            htmlFor={song.id}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <Checkbox
                              id={song.id}
                              checked={selectedPlaylists.includes(song.id)}
                              onCheckedChange={() => {
                                const isAdding = !selectedPlaylists.includes(
                                  song.id
                                );
                                setSelectedPlaylists((prev) => {
                                  if (isAdding) {
                                    return [...prev, song.id];
                                  } else {
                                    return prev.filter((id) => id !== song.id);
                                  }
                                });
                              }}
                              className="border-gray-700 data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
                            />
                            <Avatar className="h-10 w-10 rounded-md bg-[#282828]">
                              <AvatarImage
                                src={song.thumbnailUrl}
                                alt={song.title}
                              />
                              <AvatarFallback className="bg-[#282828]">
                                <Music className="h-4 w-4 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-sm font-medium text-white">
                                {song.title}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {selectedPlaylists.length} song
                      {selectedPlaylists.length !== 1 ? "s" : ""} selected
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPlaylists([])}
                        className="border-gray-700 text-white hover:bg-[#282828]"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-700 text-white hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddToAlbum}
                    className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
                  >
                    Add to Album
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddSongToAlbumDialog;
