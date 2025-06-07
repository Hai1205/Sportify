import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { User } from "@/utils/types";
import { formatNumberStyle } from "@/lib/utils";
import { ArtistSectionSkeleton } from "../skeletons/ArtistSectionSkeleton";

interface ArtistsSectionProps {
  artists: User[];
  isLoading: boolean;
}

const ArtistsSection = ({ artists, isLoading }: ArtistsSectionProps) => {
  if (isLoading) {
    return (
      <ArtistSectionSkeleton />
    );
  }

  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Top Artists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/profile/${artist.id}`}
            className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-32 w-32 border-2 border-[#1DB954]">
              <AvatarImage src={artist.avatarUrl} alt={artist.fullName} />

              <AvatarFallback className="text-6xl">
                {artist.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="font-medium text-center">{artist.fullName}</div>

            <div className="text-xs text-muted-foreground text-center">
              {formatNumberStyle(artist.followers.length)}{" "}
              
              {artist.followers.length < 2 ? "follower" : "followers"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistsSection;
