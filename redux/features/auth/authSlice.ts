// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import { jwtDecode } from "jwt-decode";

// // Types
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
// }

// interface AuthState {
//   isAuthenticated: boolean;
//   token: string | null;
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// interface JwtPayload {
//   userId: string;
//   iat: number;
//   exp: number;
// }

// interface VerifyOtpParams {
//   phoneNumber: string;
//   code: string;
// }

// // Initial state
// const initialState: AuthState = {
//   isAuthenticated: false,
//   token: null,
//   user: null,
//   loading: false,
//   error: null,
// };

// // Async thunks
// export const getUserData = createAsyncThunk(
//   "auth/getUserData",
//   async (token: string, { rejectWithValue }) => {
//     try {
//       // Decode JWT to get userId
//       const decoded = jwtDecode<JwtPayload>(token);
//       const userId = decoded.userId;

//       // Fetch user data from API
//       const response = await fetch(
//         `https://limpiar-backend.onrender.com/api/users/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch user data");
//       }

//       const userData = await response.json();
//       return userData;
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Failed to fetch user data"
//       );
//     }
//   }
// );

// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async (params: VerifyOtpParams, { getState, rejectWithValue }) => {
//     try {
//       // Get the token from the state
//       const state = getState() as { auth: AuthState };
//       const token = state.auth.token;

//       const response = await fetch(
//         "https://limpiar-backend.onrender.com/api/auth/verify-login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify(params),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Verification failed");
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Verification failed"
//       );
//     }
//   }
// );

// // Auth slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
//       state.token = action.payload.token;
//       state.loading = false;
//     },
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//     },
//     authSuccess: (state) => {
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.token = null;
//       state.user = null;
//     },
//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // getUserData
//       .addCase(getUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(getUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // verifyOtp
//       .addCase(verifyOtp.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyOtp.fulfilled, (state) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//       })
//       .addCase(verifyOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   loginStart,
//   loginSuccess,
//   setUser,
//   authSuccess,
//   logout,
//   setError,
// } = authSlice.actions;

// export default authSlice.reducer;

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Types
interface User {
  userId: string;
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface JwtPayload {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface LoginParams {
  email: string;
  password: string;
}

interface VerifyOtpParams {
  phoneNumber: string;
  code: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface VerifyOtpResponse {
  message: string;
  token: string;
  user: User;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (token: string, { rejectWithValue }) => {
    try {
      // Decode JWT to get userId
      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.userId;

      // Fetch user data from API
      const response = await fetch(
        `https://limpiar-backend.onrender.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
    }
  }
);

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://limpiar-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (params: VerifyOtpParams, { getState, rejectWithValue }) => {
    try {
      // Get the token from the state
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        throw new Error("No token available");
      }

      const response = await fetch(
        "https://limpiar-backend.onrender.com/api/auth/verify-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const data: VerifyOtpResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Verification failed"
      );
    }
  }
);

// Get the token expiration time
const getTokenExpiration = (token: string): number => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return 0;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  return expiration < Date.now();
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.loading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    authSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    checkTokenExpiration: (state) => {
      if (state.token && isTokenExpired(state.token)) {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        // Not authenticated yet until OTP verification
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUserData
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // Update token with the new one from verification
        state.token = action.payload.token;
        // Set user data
        state.user = action.payload.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  setUser,
  authSuccess,
  logout,
  setError,
  checkTokenExpiration,
} = authSlice.actions;

export default authSlice.reducer;
