import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./features/onboarding/onboardingSlice";
import propertyReducer from "./features/addProperty/propertySlice";
import ticketReducer from "./features/tickets/ticketSlice";
import bookingReducer from "./features/booking/bookingSlice";
import topUpModalReducer from "./features/topUpModalSlice/topUpModalSlice";


export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    property: propertyReducer,
    tickets: ticketReducer,
    booking: bookingReducer,
    topUpModal: topUpModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
