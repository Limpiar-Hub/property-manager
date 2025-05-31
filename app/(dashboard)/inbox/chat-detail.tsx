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
  status?: "sending" | "sent" | "read"; // ✅ Added status
}

interface Chat {
  id: string;
  participants: { id: string; type: string }[];
  taskId?: string;
  messages: Message[];
  participantInfo: Record<string, ParticipantInfo>;
}

export function ChatDetail() {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]); // ✅ Optimistic messages
  const [fetchedChatIds, setFetchedChatIds] = useState<string[]>([]);

  const dispatch: AppDispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state: RootState) => state.chat.selectedChatId);
  const chat = useAppSelector((state: RootState) =>
    state.chat.chats.find((c: Chat) => c.id === selectedChatId)
  ) as Chat | undefined;
  const loading = useAppSelector((state: RootState) => state.chat.loading);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatId && token && chat && !fetchedChatIds.includes(selectedChatId)) {
      dispatch(fetchChatMessages({ chatId: selectedChatId, token }))
        .unwrap()
        .then((res) => {
          setFetchedChatIds((prev) => [...prev, selectedChatId]);
          dispatch(markChatAsRead(selectedChatId));
          setLocalMessages([]); // ✅ Clear local messages after sync
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [selectedChatId, token, chat, dispatch, fetchedChatIds]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, localMessages]);

  const handleBack = () => {
    dispatch(setSelectedChat({ chatId: null, cleanerName: null, cleanerAvatar: null }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatId || !token || !chat || !currentUserId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      _id: tempId,
      senderId: currentUserId,
      senderType: "user",
      text: message,
      timestamp: new Date().toISOString(),
      status: "sending", // ✅ Initial status
    };

    setLocalMessages((prev) => [...prev, optimisticMsg]);
    setMessage("");

    try {
      const result = await dispatch(
        sendChatMessage({
          text: message,
          chatId: selectedChatId,
          senderType: "user",
          token,
        })
      ).unwrap();

      // ✅ Replace optimistic message with confirmed one
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...result.message, status: "sent" }
            : msg
        )
      );

      // Optional: Fetch full messages again
      const res = await dispatch(fetchChatMessages({ chatId: selectedChatId, token })).unwrap();
      setLocalMessages([]); // Clear once fetched
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
      setLocalMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
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

  const fallbackGroupAvatar =
  "https://img.freepik.com/free-photo/labor-day-celebration-with-portrait-laborer-work_23-2151755734.jpg?semt=ais_hybrid&w=740";

const isGroupChat = chat?.participants.length > 2;
const otherParticipantId = chat?.participants.find((p) => p.id !== currentUserId)?.id;

const chatName = isGroupChat
  ? "🛠️ Limpiar Task Squad 🧼 🚀 "
  : otherParticipantId
  ? chat.participantInfo[otherParticipantId]?.name || "Unknown"
  : "Unknown";

const chatAvatar = isGroupChat
  ? fallbackGroupAvatar // Use Labor Day image for group chat
  : otherParticipantId
  ? chat.participantInfo[otherParticipantId]?.avatar
  : undefined;


  const combinedMessages = [...(chat?.messages || []), ...localMessages.filter((lm) =>
    !(chat?.messages || []).some((cm) => cm.text === lm.text && cm.timestamp === lm.timestamp)
  )];

  return (
    <div className="flex flex-col max-h-full h-[100dvh]">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center">
        {isMobile && (
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="w-10 h-10 mr-3">
          {chatAvatar ? (
            <Image
              src={chatAvatar}
              alt={chatName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-200">
              {chatName.charAt(0) || "?"}
            </div>
          )}
        </Avatar>
        <div>
          <h2 className="font-medium">{chatName}</h2>
          <p className="text-xs text-gray-500">
            {chat?.taskId ? `Booking ID: ${chat.taskId}` : "Direct message"}
          </p>
        </div>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading && !fetchedChatIds.includes(selectedChatId) ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading messages...
          </div>
        ) : combinedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {combinedMessages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              const senderInfo = chat?.participantInfo[msg.senderId] || {
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
                      <p className="text-sm">{msg.text || "loading up your message in realtime..."}</p>
                      <p
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTimestamp(msg.timestamp)}
                        {isCurrentUser && (
                          <span>
                            {msg.status === "sending"
                              ? "✔"
                              : msg.status === "sent" || msg.status === "read"
                              ? "✔✔"
                              : ""}
                          </span>
                        )}
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
