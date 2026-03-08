import { Play } from "lucide-react";
import { AlbumsEmptyState } from "../../../layout/components/EmptyState";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Album } from "@/utils/types";
import { Link } from "react-router-dom";

const ProfileAlbumsList = () => {
  const { user: userAuth } = useAuthStore();
  const { user: currentUser } = useUserStore();

  const albums: Album[] = (currentUser?.albums || []) as Album[];

  const isMyProfile = currentUser?.id === userAuth?.id;

  if (albums.length === 0) {
    return isMyProfile ? (
      <AlbumsEmptyState message="You haven't created any albums yet. Albums will appear here once you're created." />
    ) : (
      <AlbumsEmptyState message="This user hasn't created any albums yet. Albums will appear here once they're created." />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <div key={album?.id} className="group relative">
          <div className="relative overflow-hidden rounded-md aspect-square bg-gray-900">
            <img
              src={album?.thumbnailUrl || "/placeholder.svg"}
              alt={album?.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-green-500 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Link to={`/album-details/${album?.id}`}>
                  <Play fill="white" size={24} />
                </Link>
              </button>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="font-medium text-sm truncate">{album?.title}</h3>

            <p className="text-gray-400 text-xs">{album?.releaseDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileAlbumsList;
