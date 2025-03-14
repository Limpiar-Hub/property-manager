"use client"

import { useSelector, useDispatch } from "react-redux"
import { Avatar } from "@/components/ui/avatar"
import { setSelectedTicket } from "@/redux/features/tickets/ticketSlice"
import type { RootState } from "@/redux/store"

export function TicketList() {
  const dispatch = useDispatch()
  const tickets = useSelector((state: RootState) => state.tickets.tickets)
  const filter = useSelector((state: RootState) => state.tickets.filter)
  const selectedTicketId = useSelector((state: RootState) => state.tickets.selectedTicketId)

  const filteredTickets = tickets.filter((ticket) => ticket.status === filter)

  if (filteredTickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
        <p className="text-center">No {filter} tickets</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {filteredTickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => dispatch(setSelectedTicket(ticket.id))}
          className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedTicketId === ticket.id ? "bg-blue-50" : ""}`}
        >
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <img src={ticket.userAvatar} alt="User avatar" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{ticket.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium
                    ${ticket.category === "Payment" ? "bg-blue-100 text-blue-700" : ""}
                    ${ticket.category === "Bookings" ? "bg-purple-100 text-purple-700" : ""}
                    ${ticket.category === "Property" ? "bg-green-100 text-green-700" : ""}
                  `}
                  >
                    {ticket.category}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{ticket.createdAt}</span>
              </div>
              <p className="text-gray-600 text-sm truncate">{ticket.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

