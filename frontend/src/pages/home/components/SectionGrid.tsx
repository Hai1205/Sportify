import { Song } from "@/utils/types";
import SectionGridSkeleton from "./skeletons/SectionGridSkeleton";
import PlayButton from "./PlayButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <Link to={`/song-details/${song.id}`}>
                  <Avatar className="h-full w-full rounded-md bg-[#282828]">
                    <AvatarImage src={song.thumbnailUrl} alt={song.title} />

                    <AvatarFallback className="bg-[#282828]">
                      <Music className="h-10 w-10 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>

              <PlayButton song={song} />
            </div>

            <h3 className="font-medium mb-2 truncate hover:underline">
              <Link to={`/song-details/${song?.id}`}>{song?.title}</Link>
            </h3>

            <p className="text-sm text-zinc-400 truncate hover:underline">
              <Link to={`/profile/${song?.user?.id}`}>{song?.user?.fullName}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
