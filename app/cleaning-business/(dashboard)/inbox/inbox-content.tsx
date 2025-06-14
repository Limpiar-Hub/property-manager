

"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MessageSquare, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketList } from "./ticket-list";
import { TicketDetail } from "./ticket-detail";
import { ChatList } from "./chat-list";
import { ChatDetail } from "./chat-detail";
import dynamic from "next/dynamic";
import { fetchTicketThreads } from "@/redux/features/tickets/ticketSlice";
import { fetchAllThreads } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";

const NewTicketDialog = dynamic(
  () =>
    import("@/components/inbox/new-ticket-dialog").then(
      (mod) => mod.NewTicketDialog
    ),
  { ssr: false }
);

export function InboxContent() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tickets" | "chats">("chats");
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const chatListLoading = useAppSelector((state: RootState) => state.chat.loading && !state.chat.chats.length);
  const ticketLoading = useAppSelector(
    (state: RootState) => state.tickets.loading
  );
  const selectedTicketId = useAppSelector(
    (state: RootState) => state.tickets.selectedTicketId
  );
  const selectedChatId = useAppSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (token && currentUserId) {
      if (activeTab === "chats") {
        dispatch(fetchAllThreads({ userId: currentUserId, token }));
      } else {
        dispatch(fetchTicketThreads({ userId: currentUserId, token }));
      }
    }
  }, [dispatch, token, activeTab, currentUserId]);

  // Show list on mobile when no item is selected, always show on desktop
  const showList = !isMobile || 
    (activeTab === "tickets" && !selectedTicketId) ||
    (activeTab === "chats" && !selectedChatId);

  // Show detail when item is selected (mobile) or always (desktop)
  const showDetail = !isMobile || 
    (activeTab === "tickets" && selectedTicketId) ||
    (activeTab === "chats" && selectedChatId);

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

            <Tabs
              defaultValue="chats"
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "tickets" | "chats")
              }
            >
              <TabsList className="w-full mb-4">
                <TabsTrigger value="chats" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chats
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex-1">
                  <TicketCheck className="w-4 h-4 mr-2" />
                  Tickets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto">
            {(activeTab === "chats" && chatListLoading) || (activeTab === "tickets" && ticketLoading) ? (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            ) : activeTab === "tickets" ? (
              <TicketList />
            ) : (
              <ChatList />
            )}
          </div>

          {activeTab === "tickets" && (
            <div className="p-4 border-t flex justify-end">
              <Button
                onClick={() => setIsNewTicketOpen(true)}
                className="w-[10rem] bg-blue-500 hover:bg-blue-700"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Ticket
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Right side - Detail */}
      {showDetail && (
        <div className="flex-1 min-w-0">
          {activeTab === "tickets" ? <TicketDetail /> : <ChatDetail />}
        </div>
      )}

      <NewTicketDialog
        open={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
      />
    </div>
  );
}