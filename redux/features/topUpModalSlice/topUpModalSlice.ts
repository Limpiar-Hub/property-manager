import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type ModalStep = "initial" | "debitCard" | "ahcTransfer"

interface TopUpModalState {
  isOpen: boolean
  isRefundModalOpen: boolean
  reason: string
  currentStep: ModalStep
  amount: number
  paymentMethod: "debit" | "ahc" | null
  userBalance: number
  paymentReference: string | null
}

const initialState: TopUpModalState = {
  isOpen: false,
  isRefundModalOpen: false,
  reason: '',
  currentStep: "initial",
  amount: 0,
  paymentMethod: null,
  userBalance: 0,
  paymentReference: null
}

const topUpModalSlice = createSlice({
  name: "topUpModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
      state.currentStep = "initial"
      // state.amount = 0
      // state.paymentMethod = null
    },
    closeModal: (state) => {
      state.isOpen = false
      state.currentStep = "initial"
      state.amount = 0
      state.paymentMethod = null
      state.paymentReference = null
    },
    openRefundModal: (state) => {
      state.isRefundModalOpen = true
    },
    setUserBalance: (state, action: PayloadAction<number>) => {
      state.userBalance = action.payload
    },
    closeRefundModal: (state) => {
      state.isRefundModalOpen = false
    },
    setReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload
    },
    setStep: (state, action: PayloadAction<ModalStep>) => {
      state.currentStep = action.payload
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
    },
    setPaymentMethod: (state, action: PayloadAction<"debit" | "ahc">) => {
      state.paymentMethod = action.payload
    },
    setPaymentReference: (state, action: PayloadAction<string>) => {
      state.paymentReference = action.payload;
    },
    goBack: (state) => {
      state.currentStep = "initial"
    },
  },
})

export const { openModal, closeModal, openRefundModal, closeRefundModal, setUserBalance, setReason, setStep, setAmount, setPaymentMethod,  setPaymentReference,goBack } = topUpModalSlice.actions

export default topUpModalSlice.reducer

