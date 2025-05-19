import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FormState {
  currentStep: number
  data: {
    // Business Information
    businessName?: string
    address?: string
    city?: string
    state?: string
    zipcode?: string
    website?: string
    referralSource?: string

    // Contact Information
    fullName?: string
    email?: string
    phoneNumber?: string
    countryCode?: string
    password?: string

    // Operating Information
    teamMembers?: string
    operatingCity?: string
    services?: string[]

    // Registration Status
    registrationStatus?: "idle" | "loading" | "success" | "error"
    registrationError?: string
  }
  auth: {
    isAuthenticated: boolean
    token: string | null
    userId: string | null
    phoneNumber: string | null
    isLoading: boolean
    error: string | null
    otpVerified: boolean
  }
}

const initialState: FormState = {
  currentStep: 1,
  data: {
    registrationStatus: "idle",
  },
  auth: {
    isAuthenticated: false,
    token: null,
    userId: null,
    phoneNumber: null,
    isLoading: false,
    error: null,
    otpVerified: false,
  },
}

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep += 1
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    updateFormData: (state, action: PayloadAction<any>) => {
      state.data = { ...state.data, ...action.payload }
    },
    resetForm: (state) => {
      state.currentStep = 1
      state.data = {
        registrationStatus: "idle",
      }
    },
    setRegistrationStatus: (state, action: PayloadAction<"idle" | "loading" | "success" | "error">) => {
      state.data.registrationStatus = action.payload
    },
    setRegistrationError: (state, action: PayloadAction<string>) => {
      state.data.registrationError = action.payload
    },
    loginStart: (state) => {
      state.auth.isLoading = true
      state.auth.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; userId: string; phoneNumber: string }>) => {
      state.auth.isLoading = false
      state.auth.isAuthenticated = true
      state.auth.token = action.payload.token
      state.auth.userId = action.payload.userId
      state.auth.phoneNumber = action.payload.phoneNumber
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.auth.isLoading = false
      state.auth.error = action.payload
    },
    verifyOtpStart: (state) => {
      state.auth.isLoading = true
      state.auth.error = null
    },
    verifyOtpSuccess: (state) => {
      state.auth.isLoading = false
      state.auth.otpVerified = true
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.auth.isLoading = false
      state.auth.error = action.payload
    },
    logout: (state) => {
      state.auth = initialState.auth
    },
  },
})

export const {
  nextStep,
  prevStep,
  goToStep,
  updateFormData,
  resetForm,
  setRegistrationStatus,
  setRegistrationError,
  loginStart,
  loginSuccess,
  loginFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} = formSlice.actions

export default formSlice.reducer
