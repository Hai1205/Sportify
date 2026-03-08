import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/utils/types";
import PlayButton from "../PlayButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.map((song: Song) => (
        <Link to={`/song-details/${song.id}`}>
          <div
            key={song.id}
            className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
          >
            {/* <img
            src={song.thumbnailUrl}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
          /> */}
            <Avatar className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-md flex-shrink-0">
              <AvatarImage src={song.thumbnailUrl} alt={song.title} />

              <AvatarFallback className="rounded-md bg-[#282828]">
                <Music className="h-10 w-10 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 p-4">
              <p className="font-medium truncate">{song.title}</p>

              <p className="text-sm text-zinc-400 truncate">
                {song.user.fullName}
              </p>
            </div>

            <PlayButton song={song} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedSection;
