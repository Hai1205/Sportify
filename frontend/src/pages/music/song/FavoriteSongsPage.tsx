import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Heart, Music, Pause, Play, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { SongsEmptyState } from "@/layout/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/layout/components/TableSkeleton";
import { Song } from "@/utils/types";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { formatTime } from "@/lib/utils";

export default function FavoriteSongsPage() {
  const [songs, setSongs] = useState<Song[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { isLoading, likeSong, getUserLikedSong } = useMusicStore();
  const { currentSong, isPlaying, togglePlay, playAlbum } = usePlayerStore();
  const { user: userAuth } = useAuthStore();

  useEffect(() => {
    const fetchSongs = async () => {
      if (userAuth?.id) {
        const likedSongs = await getUserLikedSong(userAuth?.id);
        if (likedSongs) {
          setSongs(likedSongs);
        }
      }
    };

    fetchSongs();
  }, [getUserLikedSong, likeSong, userAuth]);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const handleLike = async (song: Song) => {
    if (!userAuth) {
      return;
    }

    await likeSong(userAuth?.id, song.id);
    setSongs(songs.filter((s) => s.id !== song.id));
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Favorite Songs</h2>
      </div>

      <Tabs defaultValue="all-songs" className="space-y-4">
        <TabsContent value="all-songs" className="space-y-4">
          <Card className="bg-zinc-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Song List</CardTitle>

                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="relative w-60">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        type="search"
                        placeholder="Search songs..."
                        className="w-full pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-305px)] w-full rounded-xl">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">#</TableHead>

                      <TableHead className="text-center">Song</TableHead>

                      <TableHead className="text-center">Album</TableHead>

                      <TableHead className="text-center">Duration</TableHead>

                      <TableHead className="text-center">Views</TableHead>

                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading || !filteredSongs ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <TableSkeleton />
                        </TableCell>
                      </TableRow>
                    ) : filteredSongs.length > 0 ? (
                      filteredSongs.map((song, index) => {
                        const isCurrentSong = currentSong?.id === song.id;
                        return (
                          <TableRow
                            key={song.id}
                            className={`text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer group`}
                          >
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Link to={`/song-details/${song.id}`}>
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={song.thumbnailUrl}
                                      alt={song.title}
                                    />
                                    <AvatarFallback>
                                      <Music className="h-4 w-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                </Link>

                                <div className="flex flex-col">
                                  <Link to={`/song-details/${song.id}`}>
                                    <span
                                      className={`font-medium text-white hover:underline`}
                                    >
                                      {song.title}
                                    </span>
                                  </Link>

                                  <span className="text-sm text-muted-foreground">
                                    {song.user ? (
                                      <Link to={`/profile/${song.user.id}`}>
                                        <span className="text-center hover:underline">
                                          {song.user.fullName}
                                        </span>
                                      </Link>
                                    ) : (
                                      <span className="text-center">
                                        Unknown Artist
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              {song.album ? (
                                <Link to={`/album-details/${song.album.id}`}>
                                  <span className="text-center hover:underline">
                                    {song.album.title}
                                  </span>
                                </Link>
                              ) : (
                                <span className="text-center">No Album</span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{formatTime(song.duration)}</span>
                              </div>
                            </TableCell>

                            <TableCell className="text-center">
                              {song.views}
                            </TableCell>

                            <TableCell className="text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(song);
                                }}
                                className="rounded-full p-1 hover:text-white"
                              >
                                <Heart className="h-4 w-4" fill={"#1DB954"} />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <SongsEmptyState message="No songs found." />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
