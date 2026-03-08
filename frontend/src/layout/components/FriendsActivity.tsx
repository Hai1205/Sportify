import { useEffect, useState } from "react";
import { Music, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendPrompt from "@/layout/components/FriendPrompt";
import { User } from "@/utils/types";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";

const FriendsActivity = () => {
  const { onlineUsers, userActivities } = useChatStore();
  const { user: userAuth } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (userAuth) {
      const userFollowing = userAuth?.following as User[];

      setUsers(userFollowing);
    }
  }, [userAuth]);

  if (users.length === 0) {
    return <FriendPrompt title="Follow your friends" />;
  }

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />

          <h2 className="font-semibold">What are your friends listening?</h2>
        </div>
      </div>

      {!userAuth && <FriendPrompt title="Login" />}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((userAuth) => {
            const activity = userActivities.get(userAuth.id);
            const isPlaying = activity && activity !== "Idle";

            return (
              <Link to={`/profile/${userAuth?.id}`} key={userAuth.id}>
                <div
                  key={userAuth.id}
                  className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="size-10 border border-zinc-800">
                        <AvatarImage src={userAuth.avatarUrl} alt={userAuth.fullName} />

                        <AvatarFallback>{userAuth.fullName[0]}</AvatarFallback>
                      </Avatar>

                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${onlineUsers.has(userAuth.id) ? "bg-green-500" : "bg-zinc-500"}
												`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white hover:underline">
                          {userAuth.fullName}
                        </span>
                       
                        {isPlaying && (
                          <Music className="size-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>

                      {isPlaying ? (
                        <div className="mt-1">
                          <div className="mt-1 text-sm text-white font-medium truncate">
                            {activity.replace("Playing ", "").split(" by ")[0]}
                          </div>
                          <div className="text-xs text-zinc-400 truncate">
                            {activity.split(" by ")[1]}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-zinc-400">Idle</div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
export default FriendsActivity;
