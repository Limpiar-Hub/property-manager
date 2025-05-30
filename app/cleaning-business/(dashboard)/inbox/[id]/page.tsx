// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useAppSelector } from "@/hooks/useReduxHooks";

// export default function ChatDetail() {
//   const router = useRouter();
//   const { id: chatId } = useParams(); // Extract the chat ID from the route
//   const chats = useAppSelector((state) => state.chat.chats);

//   const chat = chats.find((chat) => chat.id === chatId);

//   if (!chat) {
//     return <p className="text-center">Chat not found</p>;
//   }

//   return (
//     <div className="w-2/3 p-6">
//       <h2 className="font-medium">Chat Details</h2>
//       <p>Chat ID: {chatId}</p>
//       <p>Participants: {chat.participants.join(", ")}</p>
//       <div className="mt-4">
//         {chat.messages.map((message, index) => (
//           <div key={index} className="mb-2">
//             <p className="text-sm text-gray-600">{message.text}</p>
//             <p className="text-xs text-gray-400">
//               {new Date(message.timestamp).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, ArrowLeft } from "lucide-react";
import {
  sendChatMessage,
  fetchChatMessages,
  markChatAsRead,
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

export default function ChatDetailPage() {
  const [message, setMessage] = useState("");
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  // Ensure chatId is a string or undefined
  const chatId = typeof params.id === 'string' ? params.id : undefined;

  const chat = useAppSelector((state: RootState) =>
    state.chat.chats.find((c: Chat) => c.id === chatId)
  ) as Chat | undefined;
  const loading = useAppSelector((state: RootState) => state.chat.loading);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [fetchedChatIds, setFetchedChatIds] = useState<string[]>([]);

  // Fetch messages only once when chat is selected
  useEffect(() => {
    // Check if chatId is a string before using it
    if (typeof chatId === "string" && token && chat && !fetchedChatIds.includes(chatId)) {
      console.log("Fetching messages for chat:", chatId);
      dispatch(fetchChatMessages({ chatId, token }))
        .unwrap()
        .then(() => {
          setFetchedChatIds((prev) => [...prev, chatId]);
          dispatch(markChatAsRead(chatId));
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [chatId, token, chat, dispatch, fetchedChatIds]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chat?.messages) {
      console.log("Chat messages:", chat.messages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // The check !chatId now correctly handles chatId being undefined
    if (!message.trim() || !chatId || !token || !chat || !currentUserId) {
      console.error("Missing required fields:", {
        message: message.trim(),
        chatIdValue: chatId, // chatId is now string | undefined
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
        chatId, // chatId is guaranteed to be string here due to the check above
        receiverId,
      });
      await dispatch(
        sendChatMessage({
          text: message,
          chatId, // chatId is guaranteed to be string here
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

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {isMobile ? (
          <div className="text-center p-4">
            <p>No chat selected</p>
            <Button onClick={() => router.push("/cleaning-business/inbox")} className="mt-4">
              Back to list
            </Button>
          </div>
        ) : (
          <p>Select a conversation to view messages</p>
        )}
      </div>
    );
  }

  const otherParticipantIds = chat?.participants.filter((id) => id !== currentUserId) || [];
  const cleanerNames = otherParticipantIds
    .map((id) => chat?.participantInfo[id]?.name || "Unknown")
    .join(", ");

  // Truncate cleaner names if too long
  const truncatedCleanerNames =
    cleanerNames.length > 30 ? `${cleanerNames.slice(0, 30)}...` : cleanerNames;

  const participantInfo: ParticipantInfo = {
    name: truncatedCleanerNames,
    avatar: chat?.participantInfo[otherParticipantIds[0]]?.avatar || "/placeholder.svg",
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center">
        {isMobile && (
          <Button variant="ghost" onClick={() => router.push("/cleaning-business/inbox")} className="mr-2">
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
        {/* The check `typeof chatId === "string"` in the useEffect handles the type for fetchedChatIds.includes */}
        {loading && typeof chatId === "string" && !fetchedChatIds.includes(chatId) ? (
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
                          // Corrected className here
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
                        {/* Ensure timestamp is valid before formatting */}
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
