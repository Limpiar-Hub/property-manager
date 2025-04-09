"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import {
  sendChatMessage,
  fetchChatMessages,
  markChatAsRead,
} from "@/redux/features/chat/chatSlice";

import {

  createTicket

} from "@/redux/features/tickets/ticketSlice";
import type { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import Image from "next/image";

export function ChatDetail() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const chat = useSelector((state: RootState) =>
    state.chat.chats.find((c) => c.id === selectedChatId)
  );
  const cleanerName = useSelector((state: RootState) => state.chat.cleanerName);
  const cleanerAvatar = useSelector(
    (state: RootState) => state.chat.cleanerAvatar
  );
  const currentUserId = "67dd4395a978408fbcd04e00"; // Replace with the actual logged-in property manager ID
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (selectedChatId) {
      // Fetch messages for the selected chat
      dispatch(
        fetchChatMessages({ chatId: selectedChatId, token: token || "" }) as any
      );

      // Mark chat as read
      dispatch(markChatAsRead(selectedChatId));
    }
  }, [selectedChatId, dispatch, token]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) return null;

  // Find the other participant (not the current user)
  const otherParticipantId =
    chat.participants.find((id) => id !== currentUserId) || "";
  const participantInfo = chat.participantInfo[otherParticipantId] || {
    name: cleanerName || "Unknown",
    avatar: cleanerAvatar || "/placeholder.svg",
  };

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!token) {
  //     console.error("Token is missing. Unable to create chat thread.");
  //     return;
  //   }

  //   if (!message.trim()) return;

  //   try {
  //     await dispatch(
  //       sendChatMessage({
  //         receiverId: otherParticipantId,
  //         text: message,
  //         chatId: chat.id,
  //         token,
  //       }) as any
  //     );

  //     // Clear message input after sending
  //     setMessage("");
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!message.trim()) return;
       if (!token) {
      console.error("Token is missing. Unable to create chat thread.");
      return;
    }
  
    try {
      if (chat.isSupportTicket) {
        // Send message to the support endpoint
        await dispatch(
          createTicket({
            userId: currentUserId,
            messageText: message,
            token,
          }) as any
        );
      } else {
        // Handle normal chat message
        await dispatch(
          sendChatMessage({
            receiverId: otherParticipantId,
            text: message,
            chatId: chat.id,
            token,
          }) as any
        );
      }
  
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            {/* {participantInfo.avatar ? (
              <img
                // src={participantInfo.avatar}
                src={cleanerAvatar || "/placeholder.svg"}
                  className="w-10 h-10 rounded-full"
                alt={participantInfo.name}
                width={40}
                height={40}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                {participantInfo.name.charAt(0)}
              </div>
            )} */}



               {/* {cleanerAvatar ? (
                <img
                  src={cleanerAvatar}
                  alt={cleanerName || "Default Name"}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {cleanerName?.charAt(0)}
                </div>
              )} */}

            

          </Avatar>
          <div>
            <h2 className="font-medium">{participantInfo.name}</h2>
            <p className="text-xs text-gray-500">
              {chat.taskId ? `Booking ID: ${chat.taskId}` : "Direct message"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex gap-2 max-w-[70%]">
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8">
                        {chat.participantInfo[msg.senderId]?.avatar ? (
                          <Image
                            src={
                              chat.participantInfo[msg.senderId]?.avatar ||
                              "/placeholder.svg"
                            }
                            alt={
                              chat.participantInfo[msg.senderId]?.name || "User"
                            }
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                            {(
                              chat.participantInfo[msg.senderId]?.name || "U"
                            ).charAt(0)}
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
                        {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
