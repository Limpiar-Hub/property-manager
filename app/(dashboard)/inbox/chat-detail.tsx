"use client";

import { useState, useEffect, useRef } from "react";
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

export function ChatDetail() {
  const [message, setMessage] = useState("");
  const dispatch: AppDispatch = useAppDispatch();
  const selectedChatId = useAppSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const chat = useAppSelector((state: RootState) =>
    state.chat.chats.find((c) => c.id === selectedChatId)
  );
  const loading = useAppSelector((state: RootState) => state.chat.loading);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (selectedChatId && token) {
      console.log("Fetching messages for chat:", selectedChatId);
      dispatch(fetchChatMessages({ chatId: selectedChatId, token })).unwrap();
      dispatch(markChatAsRead(selectedChatId));
    }
  }, [selectedChatId, dispatch, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleBack = () => {
    dispatch(
      setSelectedChat({ chatId: null, cleanerName: null, cleanerAvatar: null })
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!message.trim() || !selectedChatId || !token || !chat) {
      console.error("Missing message content, chat ID, or token.");
      return;
    }
  
    // Ensure chat has more than one participant
    const otherParticipantId =
      chat.participants.length > 1
        ? chat.participants.find((id) => id !== chat.participants[0]) // Just using the first participant as reference
        : null;
  
    // Log participants for debugging
    console.log("Chat participants:", chat.participants);
    console.log("Other participant ID:", otherParticipantId);
  
    // Check if other participant exists
    if (!otherParticipantId) {
      console.error("No other participant found or chat is not properly initialized", {
        participants: chat.participants,
      });
      alert("No other participant found or the chat is not properly initialized.");
      return;
    }
  
    try {
      // Send the chat message to the other participant using the backend API
      const response = await fetch('https://limpiar-backend.onrender.com/api/chats/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If you're using token-based authentication
        },
        body: JSON.stringify({
          receiverId: otherParticipantId,
          text: message,
          chatId: selectedChatId,
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log("Message sent successfully:", responseData);
  
      setMessage("");  // Clear message input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending your message. Please try again.");
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

  if (loading && !chat?.messages?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading messages...
      </div>
    );
  }

  const otherParticipantId =
    chat?.participants.find((id) => id !== currentUserId) || "";
  const participantInfo = chat?.participantInfo[otherParticipantId] || {
    name: "Unknown",
    avatar: "/placeholder.svg",
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center">
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
            <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
              {participantInfo.name.charAt(0)}
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
        {chat?.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {chat?.messages?.map((msg) => {
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
                            alt={chat.participantInfo[msg.senderId].name}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                            {chat.participantInfo[msg.senderId]?.name?.charAt(
                              0
                            ) || "U"}
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