import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface themeType {
    theme: "light" | "dark"
}

export interface Settings {
    isOpen: boolean,
    isProfileOpen: boolean,
    theme: 'light' | 'dark',
    showBalance: boolean
}

const initialTheme = (typeof window !== "undefined" && localStorage.getItem('theme')) || "dark"

const initialState: Settings = {
  isOpen: false,
  isProfileOpen: false,
  theme: initialTheme as "light" | "dark",
  showBalance: true
}

export const settingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<themeType["theme"]>) => {
        state.theme = action.payload;
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", action.payload);
        }
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
    setOpenProfile: (state, action: PayloadAction<boolean>) => {
        state.isProfileOpen = action.payload
      },
    setShowBalance: (state, action: PayloadAction<boolean>) => {
        state.showBalance = action.payload
    }
  },
})

export const {
  setTheme,
  setIsOpen,
  setOpenProfile,
  setShowBalance
} = settingSlice.actions

export default settingSlice.reducer;