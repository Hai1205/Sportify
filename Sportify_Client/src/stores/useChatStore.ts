import { toast } from "react-toastify";
import { Message, User, ChatRoom } from "@/utils/types";
import { create } from "zustand";
import { getChatRooms, getConversationMessages, sendMessage as apiSendMessage } from "@/utils/api/chatApi";
import { useAuthStore } from "@/stores/useAuthStore";

const sortMessagesByDate = (messages: Message[]) => {
    return [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
};

interface ChatStore {
    chatRooms: ChatRoom[];
    messages: Message[];
    activeRoomId: string | null;
    selectedUser: User | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    socket: WebSocket | null;
    isConnected: boolean;
    onlineUsers: Set<string>;
    currentPage: number;
    hasMoreMessages: boolean;
    userActivities: Map<string, string>;
    isConnecting: boolean;

    getChatRooms: () => Promise<any>;
    getMessages: (conversationId: string, page?: number, reset?: boolean) => Promise<any>;
    loadMoreMessages: () => Promise<boolean>;
    sendMessage: (conversationId: string, content: string) => void;
    setActiveRoom: (roomId: string) => void;
    setSelectedUser: (user: User | null) => void;
    initSocket: (userId: string, roomId?: string | null) => void;
    disconnectSocket: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    chatRooms: [],
    messages: [],
    activeRoomId: null,
    selectedUser: null,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    currentPage: 1,
    hasMoreMessages: false,
    userActivities: new Map(),
    isConnecting: false,

    getChatRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getChatRooms();
            set({ chatRooms: response.data.conversations || [] });
            return response.data.conversations;
        } catch (error: any) {
            const message = error.response?.data?.message || "Không thể lấy danh sách phòng chat";
            set({ error: message });
            toast.error(message);
            return [];
        } finally {
            set({ isLoading: false });
        }
    },

    getMessages: async (conversationId, page = 1, reset = false) => {
        if (!conversationId) {
            return [];
        }
        if (reset) {
            set({ currentPage: 1 });
        }
        try {
            set({
                isLoading: page === 1,
                isLoadingMore: page > 1
            });
            const response = await getConversationMessages(conversationId, page);
            const fetchedMessages = (response.data?.results.messages || []).map((msg: any) => ({
                ...msg,
                senderId: msg.sender,
                createdAt: msg.created_at,
                updatedAt: msg.updated_at,
                roomId: msg.conversation,
            }));
            const hasMore = !!response.data?.next;
            set(state => {
                let allMessages = reset ? [] : [...state.messages];
                if (page > 1) {
                    allMessages = [...fetchedMessages, ...allMessages];
                } else {
                    allMessages = fetchedMessages;
                }
                const uniqueMessages = new Map();
                allMessages.forEach((msg: Message) => {
                    uniqueMessages.set(msg.id, { ...msg, pending: false });
                });
                state.messages.forEach((msg: Message) => {
                    if (msg.pending) {
                        uniqueMessages.set(msg.tempId || msg.id, msg);
                    }
                });
                return {
                    messages: sortMessagesByDate(Array.from(uniqueMessages.values())),
                    isLoading: false,
                    isLoadingMore: false,
                    currentPage: page,
                    hasMoreMessages: hasMore
                };
            });
            return fetchedMessages;
        } catch (error: any) {
            console.error("Lỗi khi lấy tin nhắn:", error);
            const message = error.response?.data?.message || "Không thể lấy tin nhắn";
            set({ error: message, isLoading: false, isLoadingMore: false });
            toast.error(message);
            return [];
        }
    },

    loadMoreMessages: async () => {
        const { activeRoomId, currentPage, hasMoreMessages, isLoadingMore } = get();

        if (!activeRoomId || !hasMoreMessages || isLoadingMore) {
            return false;
        }

        console.log("loadMoreMessages")
        const nextPage = currentPage + 1;
        await get().getMessages(activeRoomId, nextPage, false);
        return true;
    },

    sendMessage: (conversationId, content) => {
        if (!content.trim()) return;

        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const currentUser = useAuthStore.getState().user;

        if (!currentUser) {
            toast.error("Chưa đăng nhập");
            return;
        }

        const tempMessage: Message = {
            id: tempId,
            tempId,
            content,
            senderId: currentUser.id,
            roomId: conversationId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pending: true
        };

        set(state => ({
            messages: sortMessagesByDate([...state.messages, tempMessage])
        }));
        const socket = get().socket;
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "send_message",
                senderId: currentUser.id,
                content,
                conversationId
            }));
        }
        else {
            apiSendMessage(conversationId, content)
                .then(response => {
                    set(state => {
                        const updatedMessages = state.messages.map(msg =>
                            msg.tempId === tempId ? { ...response.data.message, pending: false } : msg
                        );
                        return { messages: updatedMessages };
                    });
                })
                .catch(error => {
                    set(state => {
                        const updatedMessages = state.messages.map(msg =>
                            msg.tempId === tempId ? { ...msg, pending: false, error: true } : msg
                        );
                        return { messages: updatedMessages };
                    });

                    const errorMessage = error.response?.data?.message || "Không thể gửi tin nhắn";
                    toast.error(errorMessage);
                });
        }
    },

    setActiveRoom: (roomId) => {
        const previousRoomId = get().activeRoomId;
        if (previousRoomId && !roomId) {
            get().disconnectSocket();
        }
        if (roomId) {
            localStorage.setItem('activeRoomId', roomId);
        } else {
            localStorage.removeItem('activeRoomId');
        }

        set({
            activeRoomId: roomId,
            currentPage: 1,
            messages: [],
            hasMoreMessages: false
        });

        if (roomId) {
            get().getMessages(roomId, 1, true);
            const userId = useAuthStore.getState().user?.id;
            if (userId && (!get().isConnected || !get().socket)) {
                get().initSocket(userId, roomId);
            }
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },

    initSocket: (userId, roomId = null) => {
        if (!userId) return;
        if (get().socket) {
            console.log("Closing existing socket before creating a new one");
            get().disconnectSocket();
        }

        if (get().isConnecting) return;
        set({ isConnecting: true });

        let wsBaseUrl = import.meta.env.VITE_SERVER_WS_URL || 'ws://localhost:8001';
        if (wsBaseUrl.startsWith('http://')) {
            wsBaseUrl = 'ws://' + wsBaseUrl.substring(7);
        } else if (wsBaseUrl.startsWith('https://')) {
            wsBaseUrl = 'wss://' + wsBaseUrl.substring(8);
        }
        const wsUrl = `${wsBaseUrl}/ws/chat/${userId}/`;
        console.log("Connecting to WebSocket:", wsUrl);
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connected");
            set({ socket, isConnected: true, isConnecting: false });

            if (roomId) {
                socket.send(JSON.stringify({
                    type: "join_room",
                    roomId: roomId
                }));
            }
        };
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "users_online") {
                    set({ onlineUsers: new Set(data.users) });
                }
                else if (data.type === "new_message") {
                    const { message } = data;

                    const conversation = typeof message.conversation === 'object' ?
                        String(message.conversation) : message.conversation;
                    const sender = typeof message.sender === 'object' ?
                        String(message.sender) : message.sender;

                    const processedMessage = {
                        ...message,
                        roomId: message.roomId || conversation,
                        senderId: message.senderId || sender,
                        createdAt: message.createdAt || message.created_at,
                        updatedAt: message.updatedAt || message.updated_at,
                        conversation: conversation,
                        sender: sender,
                        id: String(message.id)
                    };

                    const activeRoomId = get().activeRoomId;
                    if (processedMessage.roomId === activeRoomId || processedMessage.conversation === activeRoomId) {
                        set(state => {
                            const messageExists = state.messages.some(msg =>
                                (msg.id === processedMessage.id) ||
                                (msg.senderId === processedMessage.senderId &&
                                    msg.content === processedMessage.content &&
                                    Math.abs(new Date(msg.createdAt).getTime() - new Date(processedMessage.createdAt).getTime()) < 5000)
                            );

                            if (messageExists) {
                                // If exists, update the temporary message
                                return {
                                    messages: state.messages.map(msg =>
                                        (msg.pending && msg.senderId === processedMessage.senderId &&
                                            msg.content === processedMessage.content) ?
                                            { ...processedMessage, pending: false } : msg
                                    )
                                };
                            } else {
                                return {
                                    messages: sortMessagesByDate([...state.messages, processedMessage])
                                };
                            }
                        });
                    }
                    set(state => {
                        const messageRoomId = processedMessage.roomId || processedMessage.conversation;
                        const updatedRooms = state.chatRooms.map(room =>
                            room.id === messageRoomId ? { ...room, lastMessage: processedMessage } : room
                        );
                        return { chatRooms: updatedRooms };
                    });
                }
            } catch (error) {
                console.error("Error parsing WebSocket message", error);
            }
        };

        socket.onclose = (event) => {
            console.log(`WebSocket disconnected, code: ${event.code}, reason: ${event.reason || "No reason provided"}`);
            set({ isConnected: false, socket: null, isConnecting: false });

            if (event.code !== 1000 && event.code !== 1011) {
                setTimeout(() => {
                    console.log("Reconnecting WebSocket...");
                    get().initSocket(userId);
                }, 5000);
            } else if (event.code === 1011) {
                console.warn("Server reported internal error (1011). Not reconnecting automatically.");
                toast.error("Lỗi kết nối với server chat. Vui lòng tải lại trang.");
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            set({ isConnecting: false });
        };
    },

    disconnectSocket: () => {
        if (get().isConnected && get().socket) {
            get().socket?.close();
            set({ isConnected: false, socket: null });
        }
    },

}));
