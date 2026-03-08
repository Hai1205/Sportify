import ProfileAlbumsList from "./ProfileAlbumList";
import ProfileSongsList from "./ProfileSongList";

interface ContentTabsProps {
  activeTab: "albums" | "songs";
  setActiveTab: (tab: "albums" | "songs") => void;
}

const ProfileContentTabs = ({ setActiveTab, activeTab }: ContentTabsProps) => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-370px)]">
      <div className="flex border-b border-gray-800 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "albums"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("albums")}
        >
          Albums
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "songs"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("songs")}
        >
          Songs
        </button>
      </div>
      {activeTab === "albums" ? <ProfileAlbumsList /> : <ProfileSongsList />}
    </div>
  );
};

export default ProfileContentTabs;
