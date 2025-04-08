import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  taskId?: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  participantInfo: {
    [key: string]: {
      name: string;
      avatar?: string;
    };
  };
}

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const createChatThread = createAsyncThunk(
  "chat/createThread",
  async ({
    participantIds,
    taskId,
    token,
  }: {
    participantIds: string[];
    taskId: string;
    token: string;
  }) => {
    try {
      const response = await axios.post(
        "https://limpiar-backend.onrender.com/api/chats/thread",
        {
          participants: participantIds,
          taskId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating chat thread:", error);
      throw error;
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({
    receiverId,
    text,
    chatId,
    token,
  }: {
    receiverId: string;
    text: string;
    chatId: string;
    token: string;
  }) => {
    try {
      const response = await axios.post(
        "https://limpiar-backend.onrender.com/api/chats/send",
        {
          receiverId,
          text,
          chatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ chatId, token }: { chatId: string; token: string }) => {
    try {
      const response = await axios.get(
        `https://limpiar-backend.onrender.com/api/chats/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  }
);

export const createSupportTicket = createAsyncThunk(
  "chat/createSupportTicket",
  async ({
    userId,
    messageText,
    token,
  }: {
    userId: string;
    messageText: string;
    token: string;
  }) => {
    try {
      const response = await axios.post(
        "https://limpiar-backend.onrender.com/api/chats/support/start",
        {
          userId,
          messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating support ticket:", error);
      throw error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    addLocalMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { chatId } = action.payload as any;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages.push(action.payload);
        chat.lastMessage = action.payload;
      }
    },
    markChatAsRead: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
        chat.messages.forEach((message) => {
          message.isRead = true;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatThread.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push({
          ...action.payload,
          messages: [],
          unreadCount: 0,
          participantInfo: {},
        });
        state.selectedChatId = action.payload.id;
      })
      .addCase(createChatThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create chat thread";
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId } = action.meta.arg;
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          chat.messages.push(action.payload);
          chat.lastMessage = action.payload;
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send message";
      })
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId } = action.meta.arg;
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        if (chatIndex > -1) {
          state.chats[chatIndex].messages = action.payload.messages;
          state.chats[chatIndex].participantInfo =
            action.payload.participantInfo || {};
          if (action.payload.messages.length > 0) {
            state.chats[chatIndex].lastMessage =
              action.payload.messages[action.payload.messages.length - 1];
          }
        } else {
          state.chats.push({
            id: chatId,
            participants: action.payload.participants || [],
            messages: action.payload.messages || [],
            unreadCount: 0,
            participantInfo: action.payload.participantInfo || {},
            lastMessage:
              action.payload.messages?.length > 0
                ? action.payload.messages[action.payload.messages.length - 1]
                : undefined,
          });
        }
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(createSupportTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push({
          ...action.payload,
          messages: action.payload.messages || [],
          unreadCount: 0,
          participantInfo: action.payload.participantInfo || {},
        });
        state.selectedChatId = action.payload.id;
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create support ticket";
      });
  },
});

export const { setSelectedChat, addLocalMessage, markChatAsRead } =
  chatSlice.actions;
export default chatSlice.reducer;
