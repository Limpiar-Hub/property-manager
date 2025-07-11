import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// export interface PropertyUnits {
//   floors: number
//   restrooms: number
//   units: number
//   breakRooms: number
//   officesRooms: number
//   cafeteria: number
//   meetingRooms: number
//   gym: number
//   lobbies: number
// }

export interface PropertyState {
  step: number
  category: string | null
  subCategory: string | null
  title: string
  // units: PropertyUnits
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    } | null
  }
  images: {
    url: string
    isCover: boolean
  }[]
  openModal: boolean
  isLoading: boolean
  error: string
}

const initialState: PropertyState = {
  step: 1,
  category: null,
  subCategory: null,
  title: "",
  // units: {
  //   floors: 0,
  //   restrooms: 0,
  //   units: 0,
  //   breakRooms: 0,
  //   officesRooms: 0,
  //   cafeteria: 0,
  //   meetingRooms: 0,
  //   gym: 0,
  //   lobbies: 0,
  // },
  location: {
    address: "",
    coordinates: null,
  },
  images: [],
  openModal: false,
  isLoading: false,
  error: ''
}

export const propertySlice = createSlice({ 
  name: "property",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setSubCategory: (state, action: PayloadAction<string>) => {
      state.subCategory = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    // setUnits: (state, action: PayloadAction<Partial<PropertyUnits>>) => {
    //   state.units = { ...state.units, ...action.payload }
    // },
    setLocation: (state, action: PayloadAction<{ address: string; coordinates: { lat: number; lng: number } }>) => {
      state.location = action.payload
    },
    openModalFunc: (state) => {
      state.openModal = true
    },
    setIsLoaing: (state, action: PayloadAction<boolean>) => {
      state.isLoading=action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error=action.payload
    },
    closeModalFunc: (state) => {
      state.openModal = false
    },
    addImage: (state, action: PayloadAction<{ url: string; isCover: boolean }>) => {
      state.images.push(action.payload)
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.url !== action.payload)
    },
    clearImages: (state) => {
      state.images.forEach((img) => {
        URL.revokeObjectURL(img.url); 
      });
      state.images = [];
    },
    
    setCoverImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map((img) => ({
        ...img,
        isCover: img.url === action.payload,
      }))
    },
    resetProperty: () => initialState,
  },
})

export const { setStep, setCategory, setSubCategory, setTitle, setIsLoaing, setError, openModalFunc, closeModalFunc, resetProperty, setLocation,addImage,removeImage,setCoverImage,clearImages  } = propertySlice.actions

export default propertySlice.reducer

