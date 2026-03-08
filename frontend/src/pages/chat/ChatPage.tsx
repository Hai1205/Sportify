import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Card } from "@/components/ui/card";
import RoomList from "./components/RoomList";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { isChatMember, getOtherUserFromRoom } from "@/utils/chatHelpers";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatPage = () => {
  const { 
    disconnectSocket, 
    getChatRooms,
    chatRooms,
    activeRoomId,
    setActiveRoom,
    setSelectedUser
  } = useChatStore();
  const { user: userAuth } = useAuthStore();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    getChatRooms().then(() => {
      const savedRoomId = localStorage.getItem('activeRoomId');
      if (savedRoomId && !activeRoomId) {
        setActiveRoom(savedRoomId);
      }
    });
    
    return () => {
      disconnectSocket();
    };
  }, [getChatRooms, disconnectSocket, setActiveRoom, activeRoomId]);

  useEffect(() => {
    if (userId && chatRooms.length > 0 && userAuth) {
      const room = chatRooms.find(room => {
        const isDirectChat = room.roomType === 'direct' || room.conversation_type === 'direct';
        if (!isDirectChat) return false;
        
        return room.members.some(member => {
          if (isChatMember(member)) {
            const memberId = member.user_data?.id || member.user;
            const result = memberId === userId;
            return result;
          }
          return member.id === userId;
        });
      });
      
      if (room) {
        setActiveRoom(room.id);
      } else {
        console.log("Room not found for userId:", userId);
      }
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, chatRooms.length, userAuth, setActiveRoom]);

  useEffect(() => {
    if (activeRoomId && chatRooms.length > 0 && userAuth) {
      localStorage.setItem('activeRoomId', activeRoomId);
      
      const currentRoom = chatRooms.find(room => room.id === activeRoomId);
      if (currentRoom) {
        const otherUser = getOtherUserFromRoom(currentRoom, userAuth.id);
        if (otherUser) {
          setSelectedUser(otherUser);
        }
      }
    }
  }, [activeRoomId, chatRooms, userAuth, setSelectedUser]);
  
  return (
    <div className="container my-0 mx-auto">
      <h1 className="text-2xl font-bold mb-3">Message</h1>
      
      <div className="grid grid-cols-12 gap-2 h-[68vh]">
        <Card className="col-span-12 md:col-span-4 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversation</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RoomList />
            </div>
          </div>
        </Card>
        
        <Card className="col-span-12 md:col-span-8 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <MessageList />
            </div>
            <Separator />
            <ChatInput />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
