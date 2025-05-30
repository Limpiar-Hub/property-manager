"use client";

import { setSelectedChat } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { User } from "lucide-react";

type ParticipantInfo = {
  name: string;
  avatar?: string;
};

interface Message {
  _id: string;
  text: string;
  timestamp?: string;
}

interface Chat {
  id: string;
  participants: { id: string; type: string }[];
  messages: Message[];
  participantInfo: Record<string, ParticipantInfo>;
  unreadCount: number;
  lastMessage?: Message;
}

export function ChatList() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state: RootState) => state.chat.chats);
  const selectedChatId = useAppSelector((state: RootState) => state.chat.selectedChatId);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);

  const handleSelectChat = (chatId: string, participantInfo: ParticipantInfo) => {
    dispatch(
      setSelectedChat({
        chatId,
        cleanerName: participantInfo.name,
        cleanerAvatar: participantInfo.avatar ?? null,
      })
    );
  };

  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      const isToday = date.toDateString() === new Date().toDateString();
      return isToday
        ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
        <p className="text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chats.map((chat) => {
        const otherParticipant = chat.participants.find((p) => p.id !== currentUserId);
        const otherParticipantId = otherParticipant?.id || "";

        const participantInfo = chat.participantInfo[otherParticipantId] || {
          name: "Unknown",
          avatar: "/placeholder.svg",
        };

        const latestMessage = chat.lastMessage || chat.messages.at(-1);

        return (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat.id, participantInfo)}
            className={`p-4 cursor-pointer transition-colors ${
              selectedChatId === chat.id
                ? "bg-blue-100 border-l-4 border-blue-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{participantInfo.name}</h3>
                  {latestMessage && (
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(latestMessage.timestamp)}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-gray-600 text-sm truncate flex-1">
                    {latestMessage?.text || "No messages yet"}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
