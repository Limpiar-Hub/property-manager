import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentModalState {
  isWithdrawModalOpen: boolean;
  isMakePaymentModalOpen: boolean;
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  recipientUserId: string;
  amount: number;
  note: string;
  userBalance: number;
}

const initialState: PaymentModalState = {
  isWithdrawModalOpen: false,
  isMakePaymentModalOpen: false,
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',
  recipientUserId: '',
  amount: 0,
  note: '',
  userBalance: 1000, // Assuming same default balance as in WalletCard
};

const paymentModalSlice = createSlice({
  name: 'paymentModal',
  initialState,
  reducers: {
    openWithdrawModal(state) {
      state.isWithdrawModalOpen = true;
    },
    closeWithdrawModal(state) {
      state.isWithdrawModalOpen = false;
      state.routingNumber = '';
      state.accountNumber = '';
      state.accountHolderName = '';
      state.amount = 0;
    },
    openMakePaymentModal(state) {
      state.isMakePaymentModalOpen = true;
    },
    closeMakePaymentModal(state) {
      state.isMakePaymentModalOpen = false;
      state.recipientUserId = '';
      state.amount = 0;
      state.note = '';
    },
    setRoutingNumber(state, action: PayloadAction<string>) {
      state.routingNumber = action.payload;
    },
    setAccountNumber(state, action: PayloadAction<string>) {
      state.accountNumber = action.payload;
    },
    setAccountHolderName(state, action: PayloadAction<string>) {
      state.accountHolderName = action.payload;
    },
    setRecipientUserId(state, action: PayloadAction<string>) {
      state.recipientUserId = action.payload;
    },
    setAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    setNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
  },
});

export const {
  openWithdrawModal,
  closeWithdrawModal,
  openMakePaymentModal,
  closeMakePaymentModal,
  setRoutingNumber,
  setAccountNumber,
  setAccountHolderName,
  setRecipientUserId,
  setAmount,
  setNote,
} = paymentModalSlice.actions;

export default paymentModalSlice.reducer;