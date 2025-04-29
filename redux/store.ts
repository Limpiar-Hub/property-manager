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
import themeReducer from "./features/themes/themeSlice"; // Import the theme reducer

// Configuration for redux-persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'token', 'user'], 
};

const themePersistConfig = {
  key: 'theme',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    property: propertyReducer,
    tickets: ticketReducer,
    chat: chatReducer,
    booking: bookingReducer,
    topUpModal: topUpModalReducer,
    theme: persistedThemeReducer, // Add the theme reducer here
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
