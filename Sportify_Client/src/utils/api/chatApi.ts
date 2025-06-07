import axiosInstance from "../service/axiosInstance";

export const getAllMessage = async (): Promise<any> => {
    return await axiosInstance.get(`/api/messages/`)
}

export const getMessages = async (myId: string, opponentId: string, page: number = 1, limit: number = 20): Promise<any> => {
    return await axiosInstance.get(`/api/messages/get-message/${myId}/${opponentId}/`, {
        params: { page, limit }
    });
}

export const startDirectChat = async (recipientId: string): Promise<any> => {
    return await axiosInstance.post(`/api/chats/start-direct/`, {
        recipient_id: recipientId
    });
}

export const getChatRooms = async (): Promise<any> => {
    return await axiosInstance.get('/api/chats/conversations/');
}

export const getConversationMessages = async (conversationId: string, page: number = 1): Promise<any> => {
    return await axiosInstance.get(`/api/chats/conversations/${conversationId}/messages/`, {
        params: { page }
    });
}

export const sendMessage = async (conversationId: string, content: string): Promise<any> => {
    return await axiosInstance.post(`/api/chats/conversations/${conversationId}/messages/`, {
        content
    });
}

export const createConversation = async (params: {
    type: "direct" | "group";
    recipientId?: string;
    name?: string;
    members?: string[];
}): Promise<any> => {
    if (params.type === "direct") {
        return await axiosInstance.post('/api/chats/conversations/', {
            type: "direct",
            members: [params.recipientId]
        });
    } else {
        return await axiosInstance.post('/api/chats/conversations/', {
            type: "group",
            name: params.name,
            members: params.members
        });
    }
};

export const markConversationAsRead = async (conversationId: string): Promise<any> => {
    return await axiosInstance.patch(`/api/chats/conversations/${conversationId}/`, {
        is_read: true
    });
}

export const getConversationDetails = async (conversationId: string): Promise<any> => {
    return await axiosInstance.get(`/api/chats/conversations/${conversationId}/`);
}