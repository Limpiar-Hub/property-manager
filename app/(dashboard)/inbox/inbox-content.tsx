"use client";

import { useEffect } from "react";
import { Search, MessageSquare, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatList } from "./chat-list";
import { ChatDetail } from "./chat-detail";
import type { RootState } from "@/redux/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchAllThreads } from "@/redux/features/chat/chatSlice";

export function InboxContent() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  
  // Distinct loading states
  const loadingThreads = useAppSelector((state: RootState) => state.chat.loadingThreads);
  const sendingMessage = useAppSelector((state: RootState) => state.chat.sendingMessage);

  const selectedChatId = useAppSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const currentUserId = useAppSelector(
    (state: RootState) => state.auth.user?._id
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (token && currentUserId) {
      dispatch(fetchAllThreads({ userId: currentUserId, token }));
    }
  }, [dispatch, token, currentUserId]);

  const renderChatSkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left side - Chat List */}
      {(!isMobile || !selectedChatId) && (
        <div className="w-full md:w-[400px] border-r flex flex-col bg-white relative">
          <div className="p-4 md:p-6 border-b bg-blue-600 md:bg-transparent text-white md:text-black">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-semibold">Inbox</h1>
              <div className="relative w-1/2 md:w-auto">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-200 md:text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full pl-4 pr-10 text-sm md:text-base bg-blue-500 md:bg-white text-white md:text-black placeholder-gray-200 md:placeholder-gray-400 border-none md:border"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              <h2 className="text-base md:text-lg font-medium">Chats</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-gray-100 md:bg-white">
            {/* Show skeleton ONLY while fetching threads, NOT when sending messages */}
            {loadingThreads && !sendingMessage ? renderChatSkeleton() : <ChatList />}
          </div>

          {/* Floating Action Button for Mobile */}
          {isMobile && (
            <button
              className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg md:hidden"
              onClick={() => alert("Start a new chat (placeholder)")}
              aria-label="Start new chat"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Right side - Chat Detail */}
      <div
        className={`flex-1 ${
          isMobile ? (selectedChatId ? "block" : "hidden") : "block"
        } bg-gray-50`}
      >
        <ChatDetail />
      </div>
    </div>
  );
}
