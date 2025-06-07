import { Link } from "react-router-dom";
import {
  MessageSquare,
  UserPlus,
  Loader2,
  UserCheck,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/utils/types";
import { createConversation } from "@/utils/api/chatApi";
import { useState, useEffect, useMemo } from "react";
import { UserListDialog } from "./UserListDialog";
import { toast } from "react-toastify";
import { formatNumberStyle, normalizeUrl } from "@/lib/utils";

interface ProfileHeaderProps {
  user: User;
  userAuth: User;
  userLoading: boolean;
  followUser: (currentUserId: string, opponentId: string) => Promise<any>;
  getUser: (userId: string) => Promise<any>;
}

const ProfileHeader = ({
  user,
  userAuth,
  userLoading,
  followUser,
}: ProfileHeaderProps) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);

  const followers = useMemo(
    () => (currentUser?.followers || []) as User[],
    [currentUser?.followers]
  );
  const following = (currentUser?.following || []) as User[];
  const isMyProfile = currentUser?.id === userAuth?.id;

  const [amIFollowing, setAmIFollowing] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState(
    currentUser?.followers?.length || 0
  );

  useEffect(() => {
    if (!user || !userAuth) return;
    const amIFollowed = userAuth
      ? followers.some((follower: User) => follower.id === userAuth.id)
      : false;

    setAmIFollowing(amIFollowed);
    setFollowersCount(followers.length);
  }, [user, followers, userAuth]);

  const follow = async (e: any) => {
    e.preventDefault();

    if (!currentUser.id || !userAuth?.id) {
      toast.error("User must be logged in to follow");
      return;
    }

    const res = await followUser(userAuth.id, currentUser.id);

    if (!res) {
      return;
    }

    const updatedFollowers = amIFollowing
      ? followers.filter((follower) => follower.id !== userAuth.id)
      : [...followers, userAuth];

    setCurrentUser((prev) => ({
      ...prev,
      followers: updatedFollowers,
    }));

    setAmIFollowing(!amIFollowing);
    setFollowersCount(updatedFollowers.length);

    if (!amIFollowing) {
      const isMutual = currentUser.following.some(
        (u) => typeof u !== "string" && u.id === userAuth.id
      );
      
      if (isMutual) {
        try {
          await createConversation({
            type: "direct",
            recipientId: currentUser.id,
          });
          console.log("recipientId", currentUser.id, typeof currentUser.id);
        } catch (err) {
        }
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-green-800 to-black p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/10">
            <AvatarImage
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
            />

            <AvatarFallback className="text-8xl font-bold">
              {currentUser.fullName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{currentUser.fullName}</h1>

            <p className="text-gray-400 mb-2">@{currentUser.username}</p>

            {currentUser.biography && (
              <p className="text-gray-300 mb-4 max-w-2xl">
                {currentUser.biography}
              </p>
            )}

            <div className="flex justify-center md:justify-start gap-4 mb-4">
              <div
                className="cursor-pointer hover:opacity-80"
                onClick={() => setShowFollowersDialog(true)}
              >
                <span className="font-bold">{formatNumberStyle(followersCount)}</span>
                <span className="text-gray-400 ml-1 hover:underline">
                  Followers
                </span>
              </div>

              <div
                className="cursor-pointer hover:opacity-80"
                onClick={() => setShowFollowingDialog(true)}
              >
                <span className="font-bold">
                  {formatNumberStyle(currentUser.following.length)}
                </span>
                <span className="text-gray-400 ml-1 hover:underline">
                  Following
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {currentUser.website && (
                <a
                  href={normalizeUrl(currentUser.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}

              {currentUser.instagram && (
                <a
                  href={normalizeUrl(currentUser.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {currentUser.twitter && (
                <a
                  href={normalizeUrl(currentUser.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}

              {currentUser.facebook && (
                <a
                  href={normalizeUrl(currentUser.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}

              {currentUser.youtube && (
                <a
                  href={normalizeUrl(currentUser.youtube)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>

            {!isMyProfile && (
              <div className="flex gap-3 justify-center md:justify-start">
                <Button
                  onClick={follow}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                  disabled={userLoading}
                >
                  {userLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : amIFollowing ? (
                    <>
                      <UserCheck size={18} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Follow</span>
                    </>
                  )}
                </Button>

                {/* Ẩn nút nhắn tin nếu chưa là bạn bè */}
                {amIFollowing && (
                  <Link
                    to={`/chat?userId=${currentUser.id}`}
                    className="bg-transparent border border-gray-400 hover:border-white text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare size={18} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <UserListDialog
        isOpen={showFollowersDialog}
        onClose={() => setShowFollowersDialog(false)}
        title="Followers"
        users={followers}
      />

      <UserListDialog
        isOpen={showFollowingDialog}
        onClose={() => setShowFollowingDialog(false)}
        title="Following"
        users={following}
      />
    </>
  );
};

export default ProfileHeader;
