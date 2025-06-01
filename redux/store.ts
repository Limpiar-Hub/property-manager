

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import propertyReducer from "./features/addProperty/propertySlice";
import ticketReducer from "./features/tickets/ticketSlice";
import bookingReducer from "./features/booking/bookingSlice";
import chatReducer from "./features/chat/chatSlice";
import topUpModalReducer from "./features/topUpModalSlice/topUpModalSlice";
import authReducer from "./features/auth/authSlice";
import loginReducer from "./features/login/loginSlice";
import paymentModalReducer from '@/redux/features/paymentModalSlice/paymentModalSlice';
import invoiceModalReducer from "./invoiceModalSlice/invoiceModalSlice";

// Configuration for redux-persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'token', 'user'], 
};

// Create the persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    property: propertyReducer,
    tickets: ticketReducer,
    chat: chatReducer,
    booking: bookingReducer,
    topUpModal: topUpModalReducer,
    paymentModal: paymentModalReducer,
    invoiceModal: invoiceModalReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
