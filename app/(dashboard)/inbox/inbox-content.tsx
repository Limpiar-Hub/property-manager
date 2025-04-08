"use client";

import { useState } from "react";
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
import { setFilter } from "@/redux/features/tickets/ticketSlice";
import type { RootState } from "@/redux/store";

const NewTicketDialog = dynamic(
  () =>
    import("@/components/inbox/new-ticket-dialog").then(
      (mod) => mod.NewTicketDialog
    ),
  {
    ssr: false,
  }
);

export function InboxContent() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tickets" | "chats">("chats");
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.tickets.filter);
  const selectedTicketId = useSelector(
    (state: RootState) => state.tickets.selectedTicketId
  );
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );

  console.log("Selected Chat ID:", selectedChatId);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left side - List */}
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

            <TabsContent value="tickets" className="border-0 p-0 m-0">
              <div className="flex gap-4 border-b">
                <button
                  onClick={() => dispatch(setFilter("open"))}
                  className={`pb-2 ${
                    filter === "open"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => dispatch(setFilter("resolved"))}
                  className={`pb-2 ${
                    filter === "resolved"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  Resolved
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === "tickets" ? <TicketList /> : <ChatList />}
        </div>

        <div className="p-4 border-t flex justify-end">
          {activeTab === "tickets" && (
            <Button
              onClick={() => setIsNewTicketOpen(true)}
              className="w-[10rem] bg-blue-500 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Right side - Detail */}
      {/* <div className="hidden md:block flex-1 bg-gray-50">
        {activeTab === "tickets" ? (
          selectedTicketId ? (
            <TicketDetail />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a ticket to view details
            </div>
          )
        ) : selectedChatId ? (
          <ChatDetail />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div> */}

<div className="hidden md:block flex-1 bg-gray-50">
  {activeTab === "tickets" ? (
    selectedTicketId ? (
      <TicketDetail />
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a ticket to view details
      </div>
    )
  ) : selectedChatId ? (
    // Ensure ChatDetail is displayed when selectedChatId is set
    <ChatDetail />
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a conversation to view messages
    </div>
  )}
</div>

      <NewTicketDialog
        open={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
      />
    </div>
  );
}
