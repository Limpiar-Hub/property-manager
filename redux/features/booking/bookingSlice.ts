import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type DateType = "one-time" | "multiple-day" | "routine"

export interface ServiceType {
  id: string
  name: string
  image: string
  price: number
}

export interface BookingState {
  step: number
  serviceType: ServiceType[]        // now an array for multiple selected services
  property: {
    id: string
    name: string
    image: string
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
  isModalOpen: boolean
}

const initialState: BookingState = {
  step: 1,
  serviceType: [],  // empty array initially
  property: null,
  date: {
    type: null,
  },
  time: "",
  isModalOpen: false,
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setServiceType: (state, action: PayloadAction<ServiceType[]>) => {
      state.serviceType = action.payload
    },
    setToggleService: (state, action: PayloadAction<ServiceType>) => {
      const service = action.payload
      const exists = state.serviceType.find((s) => s.id === service.id)
      if (exists) {
        state.serviceType = state.serviceType.filter((s) => s.id !== service.id)
      } else {
        state.serviceType.push(service)
      }
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
    openModal: (state) => {
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.step = 1
      state.serviceType = []
      state.property = null
      state.date = { type: null }
      state.time = ""
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
  setToggleService,
  setProperty,
  setDate,
  setTime,
  openModal,
  closeModal,
  resetBooking,
  setDateType,
  setSelectedDate,
  setDateRange,
  setRoutineDays,
} = bookingSlice.actions

export default bookingSlice.reducer
