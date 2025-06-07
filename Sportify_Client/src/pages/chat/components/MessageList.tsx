import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ChatHeader from "./ChatHeader";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { Loader2, AlertCircle } from "lucide-react";

const MessageList = () => {
  const { user } = useAuthStore();
  const {
    messages,
    activeRoomId,
    isLoading,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageLengthRef = useRef<number>(0);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);
  const prevMessagesRef = useRef<Array<any>>([]);
  useEffect(() => {
    if (
      messages.length > 0 &&
      prevMessageLengthRef.current < messages.length &&
      !isLoadingMore
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageLengthRef.current = messages.length;
  }, [messages, isLoadingMore]);

  useEffect(() => {
    if (
      prevMessagesRef.current.length > 0 &&
      messages.length > prevMessagesRef.current.length &&
      isLoadingMore
    ) {
      const newMessagesCount = messages.length - prevMessagesRef.current.length;
      if (containerRef.current && newMessagesCount > 0) {
        const currentScrollHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTop =
          containerRef.current.scrollTop +
          (currentScrollHeight - prevScrollHeight);
      }
    }
    if (containerRef.current) {
      setPrevScrollHeight(containerRef.current.scrollHeight);
    }
    prevMessagesRef.current = [...messages];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop } = containerRef.current;
      if (scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
        if (containerRef.current) {
          setPrevScrollHeight(containerRef.current.scrollHeight);
        }
        loadMoreMessages();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages]);

  if (!activeRoomId) {
    return <NoConversationPlaceholder />;
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  i % 2 === 0 ? "justify-start" : "justify-end"
                )}
              >
                {i % 2 === 0 && <Skeleton className="h-10 w-10 rounded-full" />}
                <div
                  className={cn(
                    "flex flex-col gap-1",
                    i % 2 === 0 ? "items-start" : "items-end"
                  )}
                >
                  <Skeleton
                    className={cn("h-4", i % 2 === 0 ? "w-24" : "w-16")}
                  />
                  <Skeleton
                    className={cn(
                      "h-10 rounded-lg",
                      i % 2 === 0 ? "w-64" : "w-48"
                    )}
                  />
                </div>
                {i % 2 !== 0 && <Skeleton className="h-10 w-10 rounded-full" />}
              </div>
            ))
        ) : messages.length > 0 ? (
          messages.map((message) => {
            const isMe = message.senderId === user?.id;

            return (
              <div
                key={message.id || message.tempId}
                className={cn(
                  "flex gap-2 max-w-[85%] group",
                  isMe ? "self-end" : "self-start"
                )}
              >
                <div
                  className={cn(
                    "flex flex-col",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3 py-1 rounded-2xl",
                      isMe
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-zinc-700 text-white rounded-bl-none",
                      message.pending && "opacity-70",
                      message.error && "bg-red-900"
                    )}
                  >
                    {message.content}
                    {message.error && (
                      <AlertCircle className="inline ml-1 h-4 w-4 text-red-200" />
                    )}
                  </div>

                  <span className="text-xs text-zinc-500 mt-1">
                    {formatMessageTime(message.createdAt)}
                    {message.pending && " • Đang gửi..."}
                    {message.error && " • Lỗi"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p>Chưa có tin nhắn</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
