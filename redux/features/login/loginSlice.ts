import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface LoginInfo {
    email: string,
    password: string
}

interface LoginState {
    step: number,
    loginInfo: LoginInfo,
    otpVerified: false,
}

const initialState: LoginState = {
    step: 1,
    loginInfo: {
        email: "",
        password: ""
    },
    otpVerified: false
  }


  export const LoginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
      setStep: (state, action: PayloadAction<number>) => {
        state.step = action.payload
      },
    },
  })

  export const { setStep } =
    LoginSlice.actions
  
  export default LoginSlice.reducer