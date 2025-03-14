"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resolveTicket } from "@/redux/features/tickets/ticketSlice"
import type { RootState } from "@/redux/store"

export function TicketDetail() {
  const [reply, setReply] = useState("")
  const dispatch = useDispatch()
  const selectedTicketId = useSelector((state: RootState) => state.tickets.selectedTicketId)
  const ticket = useSelector((state: RootState) => state.tickets.tickets.find((t) => t.id === selectedTicketId))

  if (!ticket) return null

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{ticket.title}</h2>
          {ticket.status === "open" && (
            <Button variant="outline" onClick={() => dispatch(resolveTicket(ticket.id))}>
              Resolve Ticket
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-500">Ticket Created {ticket.createdAt}</div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-4 mb-6">
          <Avatar className="w-10 h-10">
            <img src={ticket.userAvatar} alt="User avatar" />
          </Avatar>
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p>{ticket.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <img src="/placeholder.svg" alt="Your avatar" />
          </Avatar>
          <div className="flex-1">
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-full"

            />
          </div>
          {/* <Button>Send</Button> */}
        </div>
      </div>
    </div>
  )
}

