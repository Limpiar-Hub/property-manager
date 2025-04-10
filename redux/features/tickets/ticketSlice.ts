import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

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
  category: string;
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
      return response.data; // Return the ticket data from the response
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      return rejectWithValue(error.response?.data || "Failed to create ticket");
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

        // Add the new ticket to the state
        const newTicket = {
          id: action.payload._id,
          title: "Support Ticket", // Default title for support tickets
          description: action.payload.messages[0]?.text || "No description",
          category: "Support",
          status: "open" as "open" | "resolved",
          createdAt: action.payload.createdAt,
          userId: action.payload.participants[0], // Assuming the first participant is the user
          userAvatar: "/placeholder.svg", // Default avatar
          messages: action.payload.messages.map((message: any) => ({
            id: message._id,
            senderId: message.senderId,
            text: message.text,
            createdAt: message.timestamp,
            isRead: false,
          })),
        };
        state.tickets.unshift(newTicket);
        state.selectedTicketId = newTicket.id;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTicket, setSelectedTicket, setFilter, resolveTicket } =
  ticketSlice.actions;
export default ticketSlice.reducer;
