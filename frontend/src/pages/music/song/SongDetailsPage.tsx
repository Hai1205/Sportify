import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pencil,
  Clock,
  Calendar,
  BarChart2,
  Music,
  Disc3,
  MicVocal,
  Heart,
  Trash,
} from "lucide-react";
import { Song, User } from "@/utils/types";
import { useMusicStore } from "@/stores/useMusicStore";
import EditSongDialog from "@/pages/admin/songManagement/components/EditSongDialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import PlayMusic from "../../../layout/components/PlayMusic";
import { SongDetailsSkeleton } from "../components/SongDetailsSkeleton";
import { formatNumberStyle, formatTime } from "@/lib/utils";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { VideoPlayer } from "./VideoPlayer";

export default function SongDetailsPage() {
  const { getSong, likeSong, deleteSong } = useMusicStore();
  const { user: userAuth } = useAuthStore();
  const { isPlaying, currentSong } = usePlayerStore();

  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isMySong = song?.user?.id === userAuth?.id;
  const [amILiking, setAmILiking] = useState<boolean>(false);

  const isCurrentSongPlaying = currentSong?.id === song?.id && isPlaying;

  useEffect(() => {
    const fetchSong = async () => {
      if (!songId) {
        return;
      }

      setIsLoading(true);
      const fetchedSong = await getSong(songId);
      setIsLoading(false);

      if (fetchedSong) {
        setSong(fetchedSong);
      }
    };

    fetchSong();
  }, [songId, getSong]);

  const checkLiked = useCallback(
    (user: User) => {
      const likedList = (user?.likedSongs || []) as Song[];
      const isLiked = likedList.some(
        (likedSong: Song) => likedSong.id === song?.id
      );

      setAmILiking(isLiked);
    },
    [song]
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (userAuth) {
        checkLiked(userAuth);
      }
    };

    fetchUser();
  }, [checkLiked, userAuth]);

  if (isLoading) return <SongDetailsSkeleton />;

  const handleLike = async (song: Song) => {
    if (!userAuth) {
      toast.error("User must logged to like song");

      return;
    }

    const user = await likeSong(userAuth?.id, song.id);

    if (user) {
      checkLiked(user);
    }
  };

  const handleSongUpdated = (updatedSong: Song) => {
    setSong((prevSong) =>
      prevSong?.id === updatedSong.id ? updatedSong : prevSong
    );
  };

  const handleDeleteSong = async (song: Song) => {
    if (!song) {
      return;
    }

    await deleteSong(song.id, song?.user?.id as string, song.album?.id || "");
  };

  return (
    <div className="h-full flex items-stretch justify-center">
      <div className="relative w-full max-w-full transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
        {/* Main Content */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-lg font-medium leading-6 text-white">
            Song Details
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-400">
              {song
                ? `Detailed information for "${song.title}"`
                : "Song details"}
            </p>
          </div>

          {song && (
            <ScrollArea className="h-[calc(100vh-230px)] pr-4">
              <div className="grid gap-6 py-4">
                <div className="flex gap-6">
                  <Avatar className="h-32 w-32 rounded-md bg-[#282828]">
                    <AvatarImage src={song.thumbnailUrl} alt={song.title} />

                    <AvatarFallback className="bg-[#282828]">
                      <Music className="h-10 w-10 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {song.title}
                    </h2>

                    <div className="flex gap-2 mt-4">
                      <PlayMusic song={song} size="lg" />

                      {isMySong && (
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="gap-1 border-gray-700 text-white hover:bg-[#282828] h-10 z-10"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSong(song as Song)}
                            className="text-red-600 gap-1 border-gray-700 hover:bg-[#282828] h-10"
                          >
                            <Trash className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      )}

                      <button
                        onClick={() => handleLike(song)}
                        className="rounded-full p-1 hover:text-white"
                      >
                        <Heart
                          className="h-8 w-8"
                          fill={amILiking ? "#1DB954" : "transparent"}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <br />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      Song Information
                    </h3>

                    <div className="space-y-2">
                      {song?.user && (
                        <Link
                          to={`/profile/${song?.user?.id}`}
                          className="flex items-center gap-2"
                        >
                          <MicVocal className="h-4 w-4 text-gray-400" />

                          <span className="text-sm font-medium text-white">
                            Artist:
                          </span>

                          <span className="text-sm text-gray-400 hover:underline">
                            {song?.user?.fullName}
                          </span>
                        </Link>
                      )}

                      {song?.album && (
                        <Link
                          to={`/album-details/${song.album.id}`}
                          className="flex items-center gap-2"
                        >
                          <Disc3 className="h-4 w-4 text-gray-400" />

                          <span className="text-sm font-medium text-white">
                            Album:
                          </span>

                          <span className="text-sm text-gray-400">
                            {song?.album?.title}
                          </span>
                        </Link>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />

                        <span className="text-sm font-medium text-white">
                          Duration:
                        </span>

                        <span className="text-sm text-gray-400">
                          {formatTime(song?.duration || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-gray-400" />

                        <span className="text-sm font-medium text-white">
                          Views:
                        </span>

                        <span className="text-sm text-gray-400">
                          {formatNumberStyle(song.views)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />

                        <span className="text-sm font-medium text-white">
                          Release Date:
                        </span>

                        <span className="text-sm text-gray-400">
                          {song.releaseDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {song.lyrics && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        Lyrics
                      </h3>

                      <div className="h-[220px] rounded-md border border-gray-700 bg-[#282828] p-4">
                        <ScrollArea className="h-full w-full">
                          <div className="text-sm whitespace-pre-line text-gray-400">
                            {song.lyrics}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </div>

                {song.videoUrl && (
                  <VideoPlayer
                    videoUrl={song.videoUrl}
                    isPlaying={isCurrentSongPlaying}
                  />
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      <EditSongDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        song={song}
        onSongUpdated={handleSongUpdated}
      />
    </div>
  );
}
