
"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, ArrowLeft } from "lucide-react";
import {
  sendChatMessage,
  fetchChatMessages,
  markChatAsRead,
  setSelectedChat,
  addLocalMessage,
} from "@/redux/features/chat/chatSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import axios from "axios";

interface ParticipantInfo {
  name: string;
  avatar?: string;
}

interface Message {
  _id: string;
  senderId: string;
  senderType: string;
  text: string;
  fileUrl?: string | null;
  fileType?: string;
  timestamp: string;
}

interface Chat {
  id: string;
  participants: string[];
  taskId?: string;
  messages: Message[];
  participantInfo: Record<string, ParticipantInfo>;
}

// Helper function to safely format timestamp
const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return '';
    }
    
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error);
    return '';
  }
};

export function ChatDetail() {
  const [message, setMessage] = useState("");
  const dispatch: AppDispatch = useAppDispatch();
  const selectedChatId = useAppSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const chat = useAppSelector((state: RootState) =>
    state.chat.chats.find((c: Chat) => c.id === selectedChatId)
  ) as Chat | undefined;
  const loading = useAppSelector((state: RootState) => state.chat.loading);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const currentUserId = useAppSelector(
    (state: RootState) => state.auth.user?._id
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const [fetchedChatIds, setFetchedChatIds] = useState<string[]>([]);

  // Fetch messages only once when chat is selected
  useEffect(() => {
    if (
      selectedChatId &&
      token &&
      chat &&
      !fetchedChatIds.includes(selectedChatId)
    ) {
      console.log("Fetching messages for chat:", selectedChatId);
      dispatch(fetchChatMessages({ chatId: selectedChatId, token }))
        .unwrap()
        .then(() => {
          setFetchedChatIds((prev) => [...prev, selectedChatId]);
          dispatch(markChatAsRead(selectedChatId));
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [selectedChatId, token, chat, dispatch, fetchedChatIds]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chat?.messages) {
      console.log("Chat messages:", chat.messages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleBack = () => {
    dispatch(
      setSelectedChat({ chatId: null, cleanerName: null, cleanerAvatar: null })
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedChatId || !token || !currentUserId) {
      return;
    }

    try {
      // Optimistically update UI
      const tempMessage = {
        _id: Date.now().toString(), // temporary ID
        senderId: currentUserId,
        senderType: "cleaningBusiness", // or "user" depending on your logic
        text: message,
        timestamp: new Date().toISOString(), // Use ISO format consistently
        fileUrl: null,
        fileType: "other",
      };

      // Add to local state immediately
      dispatch(
        addLocalMessage({
          ...tempMessage,
          chatId: selectedChatId,
          id: tempMessage._id, // Use temporary ID
          receiverId:
            chat?.participants.find((id) => id !== currentUserId) || "Unknown",
          createdAt: tempMessage.timestamp,
          isRead: false, // Default to false for new messages
        })
      );

      // Send to server
      await axios.post(
        "https://limpiar-backend.onrender.com/api/chats/send",
        {
          chatId: selectedChatId,
          text: message,
          fileUrl: null,
          senderType: "user", // or "user"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear input field
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error notification
      // showNotification("Failed to send message", "error");
      // You might want to remove the optimistic update here
    }
  };

  if (!selectedChatId) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen md:min-h-0 text-gray-500 w-full">
        {isMobile || isTablet ? (
          <div className="text-center p-4 w-full">
            <p>No chat selected</p>
            <Button onClick={handleBack} className="mt-4">
              Back to list
            </Button>
          </div>
        ) : (
          <p>Select a conversation to view messages</p>
        )}
      </div>
    );
  }

  const otherParticipantIds =
    chat?.participants.filter((id) => id !== currentUserId) || [];
  const cleanerNames = otherParticipantIds
    .map((id) => chat?.participantInfo[id]?.name || "Unknown")
    .join(", ");

  // Truncate cleaner names if too long
  const truncatedCleanerNames =
    cleanerNames.length > 30 ? `${cleanerNames.slice(0, 30)}...` : cleanerNames;

  const participantInfo: ParticipantInfo = {
    name: truncatedCleanerNames,
    avatar:
      chat?.participantInfo[otherParticipantIds[0]]?.avatar ||
      "/placeholder.svg",
  };

  return (
    <div className="h-full min-h-screen md:min-h-0 flex flex-col w-full max-w-full overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center flex-shrink-0">
        {(isMobile || isTablet) && (
          <Button variant="ghost" onClick={handleBack} className="mr-2 flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
          {participantInfo.avatar ? (
            <Image
              src={participantInfo.avatar}
              alt={participantInfo.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-200">
              {participantInfo.name.charAt(0) || "?"}
            </div>
          )}
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium truncate">{participantInfo.name}</h2>
          <p className="text-xs text-gray-500 truncate">
            {chat?.taskId ? `Booking ID: ${chat.taskId}` : "Direct message"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        {loading && !fetchedChatIds.includes(selectedChatId) ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading messages...
          </div>
        ) : !chat?.messages || chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {chat.messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              const senderInfo = chat.participantInfo[msg.senderId] || {
                name: "Unknown",
                avatar: undefined,
              };
              return (
                <div
                  key={msg._id}
                  className={`flex items-start w-full ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                      {senderInfo.avatar ? (
                        <Image
                          src={senderInfo.avatar}
                          alt={senderInfo.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-200">
                          {senderInfo.name.charAt(0) || "?"}
                        </div>
                      )}
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg break-words ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="break-words">{msg.text}</div>
                    <div className={`text-xs mt-1 ${
                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-4 border-t bg-white flex-shrink-0 w-full"
      >
        <Input
          className="flex-1 mr-2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={!message.trim()} className="flex-shrink-0">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}