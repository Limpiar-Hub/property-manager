import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type DateType = "one-time" | "multiple-day" | "routine"

export interface BookingState {
  step: number
  serviceType: {
    id: string
    name: string
    image: string
    price: number
  } | null
  property: {
    id: string
    name: string
    // image: string
  } | null
  date: {
    type: DateType | null
    selectedDate?: string
    dateRange?: {
      start: string
      end: string
    }
    routineDays?: string[]
  }
  time: string
  // notes: string
  isModalOpen: boolean
}

const initialState: BookingState = {
  step: 1,
  serviceType: null,
  property: null,
  date: {
    type: null,
  },
  time: "",
  // notes: "",
  isModalOpen: false,
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setServiceType: (state, action: PayloadAction<BookingState["serviceType"]>) => {
      state.serviceType = action.payload
    },
    setProperty: (state, action: PayloadAction<BookingState["property"]>) => {
      state.property = action.payload
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload
    },
    // setNotes: (state, action: PayloadAction<string>) => {
    //   state.notes = action.payload
    // },
    openModal: (state) => {
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.step = 1
      state.serviceType = null
      state.property = null
      state.date = { type: null }
      state.time = ""
      state.notes = ""
    },
    resetBooking: () => initialState,
    setDateType: (state, action: PayloadAction<DateType>) => {
      state.date.type = action.payload
      // Reset other date-related fields when type changes
      state.date.selectedDate = undefined
      state.date.dateRange = undefined
      state.date.routineDays = undefined
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.date.dateRange = action.payload
    },
    setRoutineDays: (state, action: PayloadAction<string[]>) => {
      state.date.routineDays = action.payload
    },
  },
})

export const {
  setStep,
  setServiceType,
  setProperty,
  setDate,
  setTime,
  // setNotes,
  openModal,
  closeModal,
  resetBooking,
  setDateType,
  setSelectedDate,
  setDateRange,
  setRoutineDays,
} = bookingSlice.actions

export default bookingSlice.reducer

