// import { configureStore } from "@reduxjs/toolkit";
// import onboardingReducer from "./features/onboarding/onboardingSlice";
// import propertyReducer from "./features/addProperty/propertySlice";
// import ticketReducer from "./features/tickets/ticketSlice";
// import bookingReducer from "./features/booking/bookingSlice";
// import topUpModalReducer from "./features/topUpModalSlice/topUpModalSlice";
// import authReducer from "./features/auth/authSlice";"
// export const store = configureStore({
  //   reducer: {
//     // onboarding: onboardingReducer,
//     auth: authReducer,
//     property: propertyReducer,
//     tickets: ticketReducer,
//     booking: bookingReducer,
//     topUpModal: topUpModalReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import propertyReducer from "./features/addProperty/propertySlice";
import ticketReducer from "./features/tickets/ticketSlice";
import bookingReducer from "./features/booking/bookingSlice";
import topUpModalReducer from "./features/topUpModalSlice/topUpModalSlice";
import authReducer from "./features/auth/authSlice";
import loginReducer from "./features/login/loginSlice"

// Configuration for redux-persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'token', 'user'], // Only persist these fields
};

// Create the persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    property: propertyReducer,
    tickets: ticketReducer,
<<<<<<< HEAD
    booking: bookingReducer, 
    login: loginReducer
=======
    booking: bookingReducer,
    topUpModal: topUpModalReducer,
>>>>>>> ba1ca6a552d5cc17c4005d7e8d860c600435e0ab
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
