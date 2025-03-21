import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface LoginState {
    phoneNumber: number,
    otp: number
}

const initialState: LoginState = {
    phoneNumber: +2349056431251,
    otp: 776655
  }


  export const LoginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
      setPhone: (state, action: PayloadAction<number>) => {
        state.phoneNumber = action.payload
      },
      setOtp: (state, action: PayloadAction<number>) => {
        state.otp = action.payload
      },
    },
  })

  export const { setPhone, setOtp } =
    LoginSlice.actions
  
  export default LoginSlice.reducer