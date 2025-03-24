import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type ModalStep = "initial" | "debitCard" | "ahcTransfer"

interface TopUpModalState {
  isOpen: boolean
  currentStep: ModalStep
  amount: string
  paymentMethod: "debit" | "ahc" | null
}

const initialState: TopUpModalState = {
  isOpen: false,
  currentStep: "initial",
  amount: "",
  paymentMethod: null,
}

const topUpModalSlice = createSlice({
  name: "topUpModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
      state.currentStep = "initial"
      state.amount = ""
      state.paymentMethod = null
    },
    closeModal: (state) => {
      state.isOpen = false
      state.currentStep = "initial"
      state.amount = ""
      state.paymentMethod = null
    },
    setStep: (state, action: PayloadAction<ModalStep>) => {
      state.currentStep = action.payload
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload
    },
    setPaymentMethod: (state, action: PayloadAction<"debit" | "ahc">) => {
      state.paymentMethod = action.payload
    },
    goBack: (state) => {
      state.currentStep = "initial"
    },
  },
})

export const { openModal, closeModal, setStep, setAmount, setPaymentMethod, goBack } = topUpModalSlice.actions

export default topUpModalSlice.reducer

