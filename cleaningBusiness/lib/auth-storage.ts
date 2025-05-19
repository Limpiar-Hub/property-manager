// // Auth storage utilities for managing user authentication data

// // Keys for localStorage
// const TOKEN_KEY = "limpiar_token"
// const USER_DATA_KEY = "limpiar_user_data"

// // User data interface
// export interface UserData {
//   userId?: string
//   phoneNumber?: string
//   email?: string
//   businessName?: string
//   [key: string]: any
// }

// /**
//  * Save authentication token to localStorage
//  */
// export function saveToken(token: string): void {
//   if (typeof window !== "undefined") {
//     localStorage.setItem(TOKEN_KEY, token)
//     console.log("Token saved to localStorage")
//   }
// }

// /**
//  * Get authentication token from localStorage
//  */
// export function getToken(): string | null {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem(TOKEN_KEY)
//   }
//   return null
// }

// /**
//  * Save user data to localStorage
//  */
// export function saveUserData(userData: UserData): void {
//   if (typeof window !== "undefined") {
//     localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
//     console.log("User data saved to localStorage:", userData)
//   }
// }

// /**
//  * Get user data from localStorage
//  */
// export function getUserData(): UserData | null {
//   if (typeof window !== "undefined") {
//     const userData = localStorage.getItem(USER_DATA_KEY)
//     if (userData) {
//       return JSON.parse(userData)
//     }
//   }
//   return null
// }

// /**
//  * Clear all authentication data from localStorage
//  */
// export function clearAuthData(): void {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem(TOKEN_KEY)
//     localStorage.removeItem(USER_DATA_KEY)
//     console.log("Auth data cleared from localStorage")
//   }
// }

// /**
//  * Check if user is authenticated
//  */
// export function isAuthenticated(): boolean {
//   return !!getToken()
// }


// Auth storage utilities for managing user authentication data

// Keys for localStorage
const TOKEN_KEY = "limpiar_token"
const USER_DATA_KEY = "limpiar_user_data"

// User data interface
export interface UserData {
  userId?: string
  phoneNumber?: string
  email?: string
  businessName?: string
  isVerified?: boolean
  [key: string]: any
}

/**
 * Save authentication token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token)
    console.log("Token saved to localStorage")
  }
}

/**
 * Get authentication token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
    console.log("User data saved to localStorage:", userData)
  }
}

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem(USER_DATA_KEY)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error("Error parsing user data:", error)
        return null
      }
    }
  }
  return null
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    console.log("Auth data cleared from localStorage")
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}
