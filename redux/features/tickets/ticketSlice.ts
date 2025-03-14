import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type TicketCategory = "Payment" | "Bookings" | "Property"

export interface Ticket {
  id: string
  title: string
  description: string
  category: TicketCategory
  status: "open" | "resolved"
  createdAt: string
  userId: string
  userAvatar: string
}

interface TicketState {
  tickets: Ticket[]
  selectedTicketId: string | null
  filter: "open" | "resolved"
}

const initialState: TicketState = {
  tickets: [],
  selectedTicketId: null,
  filter: "open",
}

export const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload)
    },
    setSelectedTicket: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload
    },
    setFilter: (state, action: PayloadAction<"open" | "resolved">) => {
      state.filter = action.payload
    },
    resolveTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload)
      if (ticket) {
        ticket.status = "resolved"
      }
    },
  },
})

export const { addTicket, setSelectedTicket, setFilter, resolveTicket } = ticketSlice.actions
export default ticketSlice.reducer

