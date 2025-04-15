import { RootState } from "@/redux/store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { use } from "react";
import { format } from 'date-fns';




export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string; 
}

export interface Chat {
  id: string;
  participants: string[];
  taskId?: string;
  isSupportTicket?: boolean;
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
  cleanerName: string | null;
  cleanerAvatar: string | null; 
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  cleanerName: null,
  cleanerAvatar:  null,
  loading: false,
  error: null,
};

export const createChatThread = createAsyncThunk(
  "chat/createThread",
  async (
    {
      participantIds,
      taskId,
      token,
    }: {
      participantIds: string[];
      taskId: string;
      token: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;

      const existingChat = state.chat.chats.find((chat) => {
        const existingSorted = [...chat.participants].sort().join(",");
        const newSorted = [...participantIds].sort().join(",");
        return existingSorted === newSorted;
      });

      if (existingChat) {
        return existingChat;
      }

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
    } catch (error: any) {
      console.error("Error creating chat thread:", error);
      return rejectWithValue(error.response?.data || "Failed to create chat thread");
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
  async ({ chatId, token }: { chatId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://limpiar-backend.onrender.com/api/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Fetched messages for chat", chatId, ":", response.data);
      return {
        chatId,
        messages: response.data.map((msg: any) => ({
          id: msg._id,
          senderId: msg.senderId,
          text: msg.text,
          createdAt: format(new Date(msg.timestamp), 'MMMM dd, yyyy hh:mm a'),
          isRead: false,
        })),
      };
      
    } catch (error: any) {
      console.error("Error fetching chat messages:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch messages");
    }
  }
);


export const fetchAllThreads = createAsyncThunk(
  "chat/fetchAllThreads",
  // parse the userId from the token

  async ({ userId, token }: { userId: string; token: string }, { rejectWithValue }) => {

  // async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://limpiar-backend.onrender.com/api/chats/threads/${userId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching chat threads:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch threads");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (
      state,
      action: PayloadAction<{
        chatId: string | null;
        cleanerName: string | null;
        cleanerAvatar: string | null;
      }>
    ) => {
      state.selectedChatId = action.payload.chatId;
      state.cleanerName = action.payload.cleanerName;
      state.cleanerAvatar = action.payload.cleanerAvatar;
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

        // Check if the chat already exists in the state
        const newChat = action.payload;
        const chatExists = state.chats.some((chat) => chat.id === newChat.id);

        if (!chatExists) {
          state.chats.push({
            ...newChat,
            messages: [],
            unreadCount: 0,
            participantInfo: newChat.participantInfo || {},
          });
        }

        state.selectedChatId = newChat.id;
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
          const messageWithChatId = {
            ...action.payload,
            chatId, 
          };
          chat.messages.push(messageWithChatId);
          chat.lastMessage = messageWithChatId;
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
        const { chatId, messages } = action.payload;
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        
        if (chatIndex > -1) {
          state.chats[chatIndex].messages = messages;
          if (messages.length > 0) {
            state.chats[chatIndex].lastMessage = messages[messages.length - 1];
          }
          console.log("Updated messages for chat", chatId);
        } else {
          console.warn("Chat not found for messages:", chatId);
        }
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
        console.error("Failed to fetch messages:", action.error);
      })

      .addCase(fetchAllThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllThreads.fulfilled, (state, action) => {
        state.loading = false;
        const threads = action.payload.map((thread: any) => ({
          id: thread._id,
          participants: thread.participants.map((p: any) => p._id),
          taskId: thread.taskId,
          isSupportTicket: thread.chatType === "support",
          messages: [],
          lastMessage: thread.latestMessage ? {
            id: thread.latestMessage._id,
            senderId: thread.latestMessage.senderId,
            text: thread.latestMessage.text,
            createdAt: thread.latestMessage.timestamp,
            isRead: false
          } : undefined,
          unreadCount: 0,
          participantInfo: thread.participants.reduce((acc: any, participant: any) => {
            acc[participant._id] = {
              name: participant.fullName,
              avatar: participant.avatar
            };
            return acc;
          }, {})
        }));
        
        state.chats = threads;
        console.log("Fetched and transformed threads:", threads);
      })
      .addCase(fetchAllThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch threads";
      });
    

  },
});

export const { setSelectedChat, addLocalMessage, markChatAsRead } =
  chatSlice.actions;
export default chatSlice.reducer;
