"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { NewTicketDialog } from "./new-ticket-dialog"
import { TicketList } from "./ticket-list"
import { TicketDetail } from "./ticket-detail"
import dynamic from "next/dynamic";
import { setFilter } from "@/redux/features/tickets/ticketSlice"
import type { RootState } from "@/redux/store"

const NewTicketDialog = dynamic(() => import("@/components/inbox/new-ticket-dialog").then(mod => mod.NewTicketDialog), {
  ssr: false,
});

export function InboxContent() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const dispatch = useDispatch()
  const filter = useSelector((state: RootState) => state.tickets.filter)
  const selectedTicketId = useSelector((state: RootState) => state.tickets.selectedTicketId)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left side - Ticket List */}
      <div className="w-full md:w-[400px] border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Inbox</h1>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              <Input type="search" placeholder="Search" className="w-full pl-4 pr-10" />
            </div>
          </div>
          <div className="flex gap-4 border-b">
            <button
              onClick={() => dispatch(setFilter("open"))}
              className={`pb-2 ${filter === "open" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
            >
              Open
            </button>
            <button
              onClick={() => dispatch(setFilter("resolved"))}
              className={`pb-2 ${filter === "resolved" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
            >
              Resolved
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TicketList />
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button onClick={() => setIsNewTicketOpen(true)} className="w-[10rem] bg-blue-500 hover:bg-blue-700 " size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Right side - Ticket Detail */}
      <div className="hidden md:block flex-1 bg-gray-50">
        {selectedTicketId ? (
          <TicketDetail />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a ticket to view details</div>
        )}
      </div>

      <NewTicketDialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen} />
    </div>
  )
}

