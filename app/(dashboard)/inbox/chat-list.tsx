"use client";

import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@/components/ui/avatar";
import { setSelectedChat } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import Image from "next/image";

export function ChatList() {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const cleanerName = useSelector((state: RootState) => state.chat.cleanerName);
  const cleanerAvatar = useSelector(
    (state: RootState) => state.chat.cleanerAvatar
  );
  const currentUserId = "67dd4395a978408fbcd04e00"; // Replace with the actual logged-in property manager ID

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
        <p className="text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chats.map((chat, index) => {
        // Find the other participant (not the current user)
        const otherParticipantId =
          chat.participants.find((id) => id !== currentUserId) || "";

        // Use participantInfo from the chat or fallback to Redux state
        const participantInfo = chat.participantInfo[otherParticipantId] || {
          name: cleanerName || "Unknown",
          avatar: cleanerAvatar || "/placeholder.svg",
        };

        return (
          <div
            key={chat.id || `chat-${index}`}
            onClick={() =>
              dispatch(
                setSelectedChat({
                  chatId: chat.id,
                  cleanerName: participantInfo.name,
                  cleanerAvatar: participantInfo.avatar ?? null,
                })
              )
            }
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedChatId === chat.id ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                {participantInfo.avatar ? (
                  <Image
                    src={participantInfo.avatar}
                    alt={participantInfo.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                    {participantInfo.name.charAt(0)}
                  </div>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{participantInfo.name}</h3>
                  {chat.lastMessage && (
                    <span className="text-sm text-gray-500">
                      {new Date(chat.lastMessage.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-gray-600 text-sm truncate flex-1">
                    {chat.lastMessage?.text || "No messages yet"}
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



