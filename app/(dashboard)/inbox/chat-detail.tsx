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
} from "@/redux/features/chat/chatSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";

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
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [fetchedChatIds, setFetchedChatIds] = useState<string[]>([]);

  // Fetch messages only once when chat is selected
  useEffect(() => {
    if (selectedChatId && token && chat && !fetchedChatIds.includes(selectedChatId)) {
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

    if (!message.trim() || !selectedChatId || !token || !chat || !currentUserId) {
      console.error("Missing required fields:", {
        message: message.trim(),
        selectedChatId,
        token,
        chat,
        currentUserId,
      });
      alert("Cannot send message: Missing required information.");
      return;
    }

    // Find the cleaner's ID (receiverId) from participants
    const receiverId = chat.participants.find((id) => id !== currentUserId);
    if (!receiverId) {
      console.error("No receiver found in chat participants:", chat.participants);
      alert("Cannot send message: No recipient found.");
      return;
    }

    try {
      console.log("Sending message with payload:", {
        text: message,
        chatId: selectedChatId,
        receiverId,
      });
      await dispatch(
        sendChatMessage({
          text: message,
          chatId: selectedChatId,
          receiverId,
          token,
        })
      ).unwrap();
      console.log("Message sent successfully");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(
        error.message?.includes("500")
          ? "Failed to send message: Server error. Please try again later or contact support."
          : "Failed to send message: Please try again."
      );
    }
  };

  if (!selectedChatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {isMobile ? (
          <div className="text-center p-4">
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

  const otherParticipantId = chat?.participants.find((id) => id !== currentUserId) || "";
  const participantInfo: ParticipantInfo = chat?.participantInfo[otherParticipantId] || {
    name: "Unknown",
    avatar: undefined,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        {isMobile && (
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="w-10 h-10 mr-3">
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
        <div>
          <h2 className="font-medium">{participantInfo.name}</h2>
          <p className="text-xs text-gray-500">
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
          <div className="space-y-4">
            {chat.messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              const senderInfo = chat.participantInfo[msg.senderId] || {
                name: "Unknown",
                avatar: undefined,
              };
              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[70%]">
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8">
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
                      className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Unknown time"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}