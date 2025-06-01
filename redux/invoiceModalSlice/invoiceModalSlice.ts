import { createSlice } from "@reduxjs/toolkit";

interface InvoiceModalState {
  isInvoiceModalOpen: boolean;
}

const initialState: InvoiceModalState = {
  isInvoiceModalOpen: false,
};

const invoiceModalSlice = createSlice({
  name: "invoiceModal",
  initialState,
  reducers: {
    openInvoiceModal(state) {
      state.isInvoiceModalOpen = true;
    },
    closeInvoiceModal(state) {
      state.isInvoiceModalOpen = false;
    },
  },
});

export const { openInvoiceModal, closeInvoiceModal } = invoiceModalSlice.actions;
export default invoiceModalSlice.reducer;