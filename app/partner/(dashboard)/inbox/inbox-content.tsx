"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MessageSquare } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatList } from "./chat-list";
import { ChatDetail } from "./chat-detail";

import { fetchAllThreads } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";

export function InboxContent() {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const chatListLoading = useAppSelector(
    (state: RootState) => state.chat.loading && !state.chat.chats.length
  );
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

  const showList = !isMobile || !selectedChatId;

  const showDetail = !isMobile || selectedChatId;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      {/* Left side - List */}
      {showList && (
        <div className="w-full md:w-[400px] border-r flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">Inbox</h1>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full pl-4 pr-10"
                />
              </div>
            </div>

            <Tabs defaultValue="chats">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="chats" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chats
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto">
            {chatListLoading ? (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            ) : (
              <ChatList />
            )}
          </div>
        </div>
      )}

      {/* Right side - Detail */}
      {showDetail && (
        <div className="flex-1 min-w-0">
          <ChatDetail />
        </div>
      )}
    </div>
  );
}