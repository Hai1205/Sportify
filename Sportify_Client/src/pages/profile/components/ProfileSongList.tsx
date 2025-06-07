import { Clock, Music, Pause, Play } from "lucide-react";
import { SongsEmptyState } from "../../../layout/components/EmptyState";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Song } from "@/utils/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDuration, formatNumberStyle } from "@/lib/utils";

const ProfileSongsList = () => {
  const { user: userAuth } = useAuthStore();
  const { user: currentUser } = useUserStore();
  const { currentSong, playAlbum, isPlaying, togglePlay } = usePlayerStore();

  const songs: Song[] = (currentUser?.songs || []) as Song[];
  const isMyProfile = currentUser?.id === userAuth?.id;

  if (songs.length === 0) {
    return isMyProfile ? (
      <SongsEmptyState message="You haven't created any songs yet. Songs will appear here once you're created." />
    ) : (
      <SongsEmptyState message="This user hasn't created any songs yet. Songs will appear here once they're created." />
    );
  }

  const handlePlayPauseSong = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!songs) return;

    const isCurrentSong = currentSong?.id === songs[index].id;
    if (isCurrentSong) {
      togglePlay();
    } else {
      playAlbum(songs as Song[], index);
    }
  };

  return (
    <div className="overflow-x-auto">
      <ScrollArea className="flex-1 h-full">
        <div className="bg-black/20 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
            <div>#</div>

            <div>Title</div>

            <div>Release Date</div>

            <div>Views</div>

            <div>
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Songs List */}
          <div className="px-6">
            <div className="space-y-2 py-4">
              {songs.map((song, index) => {
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
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {(!isCurrentSong || !isPlaying) && (
                        <Play
                          className="h-4 w-4 hidden group-hover:block"
                          onClick={(e) => handlePlayPauseSong(index, e)}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/song-details/${song.id}`}>
                        <div className="flex justify-center">
                          <Avatar className="h-9 w-9 rounded-md">
                            <AvatarImage
                              src={song.thumbnailUrl}
                              alt={song.title}
                            />

                            <AvatarFallback>
                              <Music className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </Link>

                      <div>
                        <Link to={`/song-details/${song.id}`}>
                          <div
                            className={`font-medium text-white hover:underline`}
                          >
                            {song.title}
                          </div>
                        </Link>

                        <Link to={`/album-details/${song.album?.id}`}>
                          <div className={`text-zinc-400 hover:underline`}>
                            {song.album?.title}
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center">{song.releaseDate}</div>

                    <div className="flex items-center">{formatNumberStyle(song.views)}</div>

                    <div className="flex items-center">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfileSongsList;
