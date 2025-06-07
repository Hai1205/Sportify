import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { activeRoomId, sendMessage } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeRoomId) return;

    sendMessage(activeRoomId, message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Input your message..."
          className="flex-1 h-10"
          disabled={!activeRoomId}
        />

        <Button
          type="submit"
          size="icon"
          className="bg-transparent hover:bg-transparent p-0 self-center"
          disabled={!message.trim() || !activeRoomId}
        >
          <Send className="h-6 w-6 text-[#1DB954] hover:text-[#1ed760]" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
