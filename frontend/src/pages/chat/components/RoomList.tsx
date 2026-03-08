import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { ChatRoom } from "@/utils/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { isChatMember, getOtherUserFromRoom } from "@/utils/chatHelpers";


const RoomList = () => {
  const { user: userAuth } = useAuthStore();
  const {
    chatRooms,
    getChatRooms,
    setActiveRoom,
    setSelectedUser,
    activeRoomId,
    isLoading,
    onlineUsers
  } = useChatStore();

  useEffect(() => {
    if (userAuth) {
      getChatRooms();
    }
  }, [userAuth, getChatRooms]);

  const getDirectChatName = (room: ChatRoom) => {
    if (room.display_name) {
      return room.display_name;
    }
    if ((room.roomType === 'direct' || room.conversation_type === 'direct') && room.members?.length === 2) {
      const otherUser = getOtherUserFromRoom(room, userAuth?.id || '');
      if (otherUser) {
        
        return otherUser.fullName || otherUser.username || 'Sportify User';
      }
    }

      return room.name || 'New Chat';
  };

  const getDirectChatAvatar = (room: ChatRoom) => {
    if ((room.roomType === 'direct' || room.conversation_type === 'direct') && room.members?.length === 2) {
      const otherUser = getOtherUserFromRoom(room, userAuth?.id || '');
      if (otherUser) {
        return otherUser.avatarUrl || '';
      }
    }
    return '';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isUserOnline = (room: ChatRoom) => {
    if ((room.roomType === 'direct' || room.conversation_type === 'direct') && room.members?.length === 2) {
      const otherMember = room.members.find(member => {
        if (isChatMember(member)) {
          const memberId = member.user_data?.id || member.user;
          return memberId !== userAuth?.id;
        } else {
          return member.id !== userAuth?.id;
        }
      });

      if (!otherMember) return false;

      let otherUserId: string | undefined;

      if (isChatMember(otherMember)) {
        otherUserId = otherMember.user_data?.id || otherMember.user;
      } else {
        otherUserId = otherMember.id;
      }

      return otherUserId ? onlineUsers.has(otherUserId) : false;
    }
    return false;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Hôm qua';
    }

    return date.toLocaleDateString();
  };

  const handleSelectRoom = (room: ChatRoom) => {
    console.log("handleSelectRoom")
    setActiveRoom(room.id);

    if (room.roomType === 'direct' || room.conversation_type === 'direct') {
      const otherUser = getOtherUserFromRoom(room, userAuth?.id || '');
      if (otherUser) {
        setSelectedUser(otherUser);
      }
    } else {
      setSelectedUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No conversation</p>
        <p className="text-sm text-muted-foreground">
          Start a new conversation by searching for a user
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {chatRooms.map(room => {
        const chatName = getDirectChatName(room);
        const avatar = getDirectChatAvatar(room);
        const initials = getInitials(chatName);
        const isOnline = isUserOnline(room);
        const lastMessage = room.lastMessage;
        const isActive = room.id === activeRoomId;

        return (
          <div
            key={room.id}
            onClick={() => handleSelectRoom(room)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted/30 transition-colors",
              isActive && "bg-muted/50"
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                {avatar ? (
                  <AvatarImage src={avatar} alt={chatName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
              )}
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">{chatName}</p>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>

              {lastMessage ? (
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage.senderId === userAuth?.id ? "Bạn: " : ""}
                  {lastMessage.content}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No message
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;