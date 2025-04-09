// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// export type TicketCategory = "Payment" | "Bookings" | "Property"

// export interface Ticket {
//   id: string
//   title: string
//   description: string
//   category: TicketCategory
//   status: "open" | "resolved"
//   createdAt: string
//   userId: string
//   userAvatar: string
// }

// interface TicketState {
//   tickets: Ticket[]
//   selectedTicketId: string | null
//   filter: "open" | "resolved"
// }

// const initialState: TicketState = {
//   tickets: [],
//   selectedTicketId: null,
//   filter: "open",
// }

// export const ticketSlice = createSlice({
//   name: "tickets",
//   initialState,
//   reducers: {
//     addTicket: (state, action: PayloadAction<Ticket>) => {
//       state.tickets.unshift(action.payload)
//     },
//     setSelectedTicket: (state, action: PayloadAction<string | null>) => {
//       state.selectedTicketId = action.payload
//     },
//     setFilter: (state, action: PayloadAction<"open" | "resolved">) => {
//       state.filter = action.payload
//     },
//     resolveTicket: (state, action: PayloadAction<string>) => {
//       const ticket = state.tickets.find((t) => t.id === action.payload)
//       if (ticket) {
//         ticket.status = "resolved"
//       }
//     },
//   },
// })

// export const { addTicket, setSelectedTicket, setFilter, resolveTicket } = ticketSlice.actions
// export default ticketSlice.reducer




import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type TicketCategory = "Payment" | "Bookings" | "Property";

export interface TicketMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: "open" | "resolved";
  createdAt: string;
  userId: string;
  userAvatar: string;
  messages: TicketMessage[];
}

interface TicketState {
  tickets: Ticket[];
  selectedTicketId: string | null;
  filter: "open" | "resolved";
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  selectedTicketId: null,
  filter: "open",
  loading: false,
  error: null,
};

// Async thunk to create a new ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (
    {
      userId,
      messageText,
      token,
    }: {
      userId: string;
      messageText: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://limpiar-backend.onrender.com/api/chats/support/start",
        {
          userId,
          messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      return rejectWithValue(error.response?.data || "Failed to create ticket");
    }
  }
);

// Async thunk to send a message under a ticket
export const sendTicketMessage = createAsyncThunk(
  "tickets/sendTicketMessage",
  async (
    {
      ticketId,
      userId,
      messageText,
      token,
    }: {
      ticketId: string;
      userId: string;
      messageText: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `https://limpiar-backend.onrender.com/api/chats/support/${ticketId}/message`,
        {
          userId,
          messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error sending ticket message:", error);
      return rejectWithValue(error.response?.data || "Failed to send ticket message");
    }
  }
);

export const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
    },
    setSelectedTicket: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
    setFilter: (state, action: PayloadAction<"open" | "resolved">) => {
      state.filter = action.payload;
    },
    resolveTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload);
      if (ticket) {
        ticket.status = "resolved";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push({
          ...action.payload,
          messages: action.payload.messages || [],
        });
        state.selectedTicketId = action.payload.id;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendTicketMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendTicketMessage.fulfilled, (state, action) => {
        state.loading = false;
        const ticket = state.tickets.find((t) => t.id === action.meta.arg.ticketId);
        if (ticket) {
          ticket.messages.push(action.payload);
        }
      })
      .addCase(sendTicketMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTicket, setSelectedTicket, setFilter, resolveTicket } = ticketSlice.actions;
export default ticketSlice.reducer;