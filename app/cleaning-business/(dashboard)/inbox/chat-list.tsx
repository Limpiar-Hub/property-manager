"use client";

import { setSelectedChat } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { User } from "lucide-react";

// Define a type for participantInfo
type ParticipantInfo = {
  name: string;
  avatar: string;
};

export function ChatList() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state: RootState) => state.chat.chats);
  const selectedChatId = useAppSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const loading = useAppSelector((state: RootState) => state.chat.loading);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);

  const handleSelectChat = (chatId: string, participantInfo: ParticipantInfo) => {
    dispatch(
      setSelectedChat({
        chatId,
        cleanerName: participantInfo.name,
        cleanerAvatar: participantInfo.avatar,
      })
    );
  };

  if (loading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading chats...
      </div>
    );
  }

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
        // Filter out the current user ID from participants
        const cleanerIds = chat.participants.filter((id) => id !== currentUserId);
  
        // Get cleaner names from participantInfo
        const cleanerNames = cleanerIds
          .map((id) => chat.participantInfo[id]?.name || "Unknown")
          .join(", ");
  
        // Truncate cleaner names if too long
        const truncatedCleanerNames =
          cleanerNames.length > 30 ? `${cleanerNames.slice(0, 30)}...` : cleanerNames;
  
        const participantInfo: ParticipantInfo = {
          name: truncatedCleanerNames,
          avatar: chat.participantInfo[cleanerIds[0]]?.avatar || "/placeholder.svg",
        };
  
        // Use firstMessage or fallback to messages[0]
        const firstMessage =
          (chat.messages && chat.messages.length > 0
            ? { text: chat.messages[0].text, createdAt: chat.messages[0].timestamp }
            : undefined) ||
          (chat.messages && chat.messages.length > 0
            ? { text: chat.messages[0].text, createdAt: chat.messages[0].timestamp }
            : undefined);
  
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
              {/* Normal Avatar Icon */}
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{participantInfo.name}</h3>
                  {firstMessage && (
                    <span className="text-sm text-gray-500">
                      {(() => {
                        const date = new Date(firstMessage.createdAt);
                        const isToday = date.toDateString() === new Date().toDateString();
                        return isToday
                          ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString([], { month: "short", day: "numeric" });
                      })()}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-gray-600 text-sm truncate flex-1">
                    {firstMessage?.text || "No messages yet"}
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

  //   <div className="divide-y">
  //     {chats.map((chat) => {
  //       const otherParticipantId =
  //         chat.participants.find((id) => id !== currentUserId) || "";
  //       const participantInfo: ParticipantInfo = {
  //         name: chat.participantInfo[otherParticipantId]?.name || "Unknown",
  //         avatar: chat.participantInfo[otherParticipantId]?.avatar || "/placeholder.svg",
  //       };

  //       // Use firstMessage or fallback to messages[0]
  //       const firstMessage = chat.firstMessage || (chat.messages && chat.messages.length > 0
  //         ? { text: chat.messages[0].text, createdAt: chat.messages[0].timestamp }
  //         : undefined);

  //       return (
  //         <div
  //           key={chat.id}
  //           onClick={() => handleSelectChat(chat.id, participantInfo)}
  //           className={`p-4 cursor-pointer transition-colors ${
  //             selectedChatId === chat.id
  //               ? "bg-blue-100 border-l-4 border-blue-500"
  //               : "hover:bg-gray-50"
  //           }`}
  //         >
  //           <div className="flex gap-3">
  //             {/* Normal Avatar Icon */}
  //             <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
  //               <User className="w-6 h-6 text-white" />
  //             </div>
  //             <div className="flex-1 min-w-0">
  //               <div className="flex justify-between items-start mb-1">
  //                 <h3 className="font-medium">{participantInfo.name}</h3>
  //                 {firstMessage && (
  //                   <span className="text-sm text-gray-500">
  //                     {(() => {
  //                       const date = new Date(firstMessage.createdAt);
  //                       const isToday = date.toDateString() === new Date().toDateString();
  //                       return isToday
  //                         ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  //                         : date.toLocaleDateString([], { month: "short", day: "numeric" });
  //                     })()}
  //                   </span>
  //                 )}
  //               </div>
  //               <div className="flex items-center">
  //                 <p className="text-gray-600 text-sm truncate flex-1">
  //                   {firstMessage?.text || "No messages yet"}
  //                 </p>
  //                 {chat.unreadCount > 0 && (
  //                   <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
  //                     {chat.unreadCount}
  //                   </span>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}


