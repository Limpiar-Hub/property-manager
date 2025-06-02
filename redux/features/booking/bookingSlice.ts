import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type DateType = "one-time" | "multiple-day" | "routine"

export interface ServiceType {
  id: string
  name: string
  image: string
  price: number
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

export interface BookingState {
  step: number
  serviceType: ServiceType[]
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
  timeSlots: TimeSlot[]
  isModalOpen: boolean
}

const initialState: BookingState = {
  step: 1,
  serviceType: [],
  property: null,
  date: {
    type: null,
  },
  timeSlots: [],
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
    setTimeSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.timeSlots = action.payload
    },
    updateTimeSlot: (
      state,
      action: PayloadAction<{ id: string; key: "startTime" | "endTime"; value: string }>
    ) => {
      const { id, key, value } = action.payload
      const slot = state.timeSlots.find((slot) => slot.id === id)
      if (slot) {
        slot[key] = value
      }
    },
    addTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      state.timeSlots.push(action.payload)
    },
    removeTimeSlot: (state, action: PayloadAction<string>) => {
      state.timeSlots = state.timeSlots.filter((slot) => slot.id !== action.payload)
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
      state.timeSlots = []
    },
    resetBooking: () => initialState,
    setDateType: (state, action: PayloadAction<DateType>) => {
      state.date.type = action.payload
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
  setTimeSlots,
  updateTimeSlot,
  addTimeSlot,
  removeTimeSlot,
  openModal,
  closeModal,
  resetBooking,
  setDateType,
  setSelectedDate,
  setDateRange,
  setRoutineDays,
} = bookingSlice.actions

export default bookingSlice.reducer
