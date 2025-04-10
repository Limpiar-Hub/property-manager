"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, MessageSquare, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketList } from "./ticket-list";
import { TicketDetail } from "./ticket-detail";
import { ChatList } from "./chat-list";
import { ChatDetail } from "./chat-detail";
import dynamic from "next/dynamic";
import {
  setFilter,
  fetchTicketThreads,
} from "@/redux/features/tickets/ticketSlice";
import { fetchAllThreads } from "@/redux/features/chat/chatSlice";
import type { RootState } from "@/redux/store";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const chatLoading = useSelector((state: RootState) => state.chat.loading);
  const ticketLoading = useSelector(
    (state: RootState) => state.tickets.loading
  );
  const selectedTicketId = useSelector(
    (state: RootState) => state.tickets.selectedTicketId
  );
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (token) {
      if (activeTab === "chats") {
        dispatch(fetchAllThreads(token) as any);
      } else {
        dispatch(
          fetchTicketThreads({
            userId: "67dd4395a978408fbcd04e00",
            token,
          }) as any
        );
      }
    }
  }, [dispatch, token, activeTab]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left side - List */}

      {(!isMobile ||
        (activeTab === "tickets" && !selectedTicketId) ||
        (activeTab === "chats" && !selectedChatId)) && (
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
            {chatLoading || ticketLoading ? (
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
      {/* <div className="hidden md:block flex-1 bg-gray-50">
        {activeTab === "tickets" ? (
          <TicketDetail />
        ) : (
          <ChatDetail />
        )}
      </div> */}

      <div
        className={`flex-1 ${
          isMobile
            ? selectedTicketId || selectedChatId
              ? "block"
              : "hidden"
            : "block"
        }`}
      >
        {activeTab === "tickets" ? <TicketDetail /> : <ChatDetail />}
      </div>

      {/* Mobile view - Show detail when selected */}
      <div className="md:hidden flex-1 bg-gray-50">
        {activeTab === "tickets" ? <TicketDetail /> : <ChatDetail />}
      </div>

      <NewTicketDialog
        open={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
      />
    </div>
  );
}
