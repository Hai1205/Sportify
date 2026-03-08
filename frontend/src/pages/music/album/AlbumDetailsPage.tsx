import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  Disc,
  Music,
  Pause,
  Pencil,
  Play,
  Heart,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Album, Song, User } from "@/utils/types";
import { useAuthStore } from "@/stores/useAuthStore";
import EditAlbumDialog from "@/pages/admin/albumManagement/components/EditAlbumDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import { AlbumDetailsSkeleton } from "../components/ALbumDetailsSkeleton";
import { formatTime } from "@/lib/utils";

export default function AlbumDetailsPage() {
  const { albumId } = useParams();

  const { getAlbum, likeAlbum, deleteAlbum } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { user: userAuth } = useAuthStore();

  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [amILiking, setAmILiking] = useState<boolean>(false);
  const isMyAlbum = currentAlbum?.user?.id === userAuth?.id;

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!albumId) {
        return;
      }

      setIsLoading(true);
      const fetchedAlbum = await getAlbum(albumId);
      setIsLoading(false);

      if (fetchedAlbum) {
        setCurrentAlbum(fetchedAlbum);
      }
    };

    fetchAlbum();
  }, [getAlbum, albumId]);

  const checkLiked = useCallback(
    (user: User) => {
      const likedList = (user?.likedAlbums || []) as Album[];
      const isLiked = likedList.some(
        (likedAlbum: Album) => likedAlbum.id === currentAlbum?.id
      );

      setAmILiking(isLiked);
    },
    [currentAlbum]
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (userAuth) {
        checkLiked(userAuth);
      }
    };

    fetchUser();
  }, [checkLiked, userAuth]);

  const handleLike = async (album: Album) => {
    if (!userAuth) {
      toast.error("User must logged to like album");

      return;
    }

    const user = await likeAlbum(userAuth?.id, album.id);

    if (user) {
      checkLiked(user);
    }
  };

  if (isLoading) return <AlbumDetailsSkeleton />;

  const songsLength = currentAlbum?.songs?.length ?? 0;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song.id === currentSong?.id
    );

    if (isCurrentAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlayPauseSong = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAlbum?.songs) return;

    const isCurrentSong = currentSong?.id === currentAlbum.songs[index].id;
    if (isCurrentSong) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.songs as Song[], index);
    }
  };

  const handleAlbumUpdated = (updatedAlbum: Album) => {
    setCurrentAlbum((prevAlbum) =>
      prevAlbum?.id === updatedAlbum.id ? updatedAlbum : prevAlbum
    );
  };

  const handleDeleteAlbum = async (album: Album) => {
    if (!album) {
      return;
    }

    await deleteAlbum(album.id, album?.user?.id || "");
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div className="flex justify-center">
                <Avatar className="h-60 w-60 rounded-md">
                  <AvatarImage
                    src={currentAlbum?.thumbnailUrl}
                    alt={currentAlbum?.title}
                  />

                  <AvatarFallback>
                    <Disc className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>

                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <Link to={`/profile/${currentAlbum?.user?.id}`}>
                    <span className="font-medium text-white hover:underline">
                      {currentAlbum?.user?.fullName}
                    </span>
                  </Link>

                  <span>
                    • {songsLength ?? 0}
                    {songsLength && songsLength > 1 ? " songs" : " song"}
                  </span>

                  <span>• {currentAlbum?.releaseDate}</span>
                </div>
              </div>

              {isMyAlbum && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="gap-1 border-gray-700 text-white hover:bg-[#282828] h-10"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlbum(currentAlbum as Album)}
                    className="text-red-600 gap-1 border-gray-700 hover:bg-[#282828] h-10"
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song.id === currentSong?.id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>

              {currentAlbum && (
                <button
                  onClick={() => handleLike(currentAlbum)}
                  className="rounded-full p-1 hover:text-white"
                >
                  <Heart
                    className="h-8 w-8"
                    fill={amILiking ? "#1DB954" : "transparent"}
                  />
                </button>
              )}
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>

                <div>Title</div>

                <div>Views</div>

                <div>Duration</div>

                <div>Released Date</div>
              </div>

              {/* songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <Pause
                              className="h-4 w-4 cursor-pointer"
                              onClick={(e) => handlePlayPauseSong(index, e)}
                            />
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {(!isCurrentSong || !isPlaying) && (
                            <Play
                              className="h-4 w-4 hidden group-hover:block"
                              onClick={(e) => handlePlayPauseSong(index, e)}
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex justify-center">
                            <Link to={`/song-details/${song.id}`}>
                              <Avatar className="h-9 w-9 rounded-md">
                                <AvatarImage
                                  src={song.thumbnailUrl}
                                  alt={song.title}
                                />

                                <AvatarFallback>
                                  <Music className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                          </div>

                          <div>
                            <div
                              className={`font-medium text-white hover:underline`}
                            >
                              <Link to={`/song-details/${song.id}`}>
                                {song.title}
                              </Link>
                            </div>

                            <div
                              className={`text-sm text-zinc-400 hover:underline`}
                            >
                              <Link to={`/profile/${song?.user?.id}`}>
                                {song?.user?.fullName}
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">{song.views}</div>

                        <div className="flex items-center">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{formatTime(song.duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {song.releaseDate}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <EditAlbumDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        album={currentAlbum}
        onAlbumUpdated={handleAlbumUpdated}
      />
    </div>
  );
}
