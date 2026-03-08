import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileContentTabs from "./components/ProfileContentTabs";
import { useUserStore } from "@/stores/useUserStore";
import { useParams } from "react-router-dom";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/utils/types";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"albums" | "songs">("albums");
  const { userId } = useParams();
  const { user: userAuth, isLoading: authLoading } = useAuthStore();

  const {
    isLoading: userLoading,
    user: currentUser,
    getUser,
    followUser,
  } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        await getUser(userId);
      }
    };

    fetchUser();
  }, [getUser, userId]);

  if (authLoading || userLoading || !currentUser) {
    return (
      <ScrollArea className="flex-1 h-full">
        <ProfileSkeleton />
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="relative pb-20">
        <ProfileHeader
          user={currentUser}
          userAuth={userAuth as User}
          userLoading={userLoading}
          followUser={followUser}
          getUser={getUser}
        />

        <ProfileContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ScrollArea>
  );
};

export default ProfilePage;
