// // Token utilities for decoding JWT tokens

// interface DecodedToken {
//     phoneNumber?: string
//     exp?: number
//     iat?: number
//     [key: string]: any
//   }
  
//   /**
//    * Decode a JWT token to extract its payload
//    */
//   export function decodeToken(token: string): DecodedToken {
//     try {
//       // Split the token into parts
//       const parts = token.split(".")
  
//       if (parts.length !== 3) {
//         console.error("Invalid token format")
//         return {}
//       }
  
//       // Decode the payload (second part)
//       const payload = parts[1]
//       const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join(""),
//       )
  
//       return JSON.parse(jsonPayload)
//     } catch (error) {
//       console.error("Error decoding token:", error)
//       return {}
//     }
//   }
  
//   /**
//    * Extract phone number from a decoded token
//    */
//   export function extractPhoneNumber(token: string): string | null {
//     try {
//       const decoded = decodeToken(token)
//       console.log("Decoded token:", decoded)
  
//       // Look for common phone number fields in the token
//       // Adjust these based on your actual token structure
//       const phoneNumber = decoded.phoneNumber || decoded.phone || decoded.phone_number
  
//       if (phoneNumber) {
//         return phoneNumber
//       }
  
//       // If we can't find a phone number field, log the issue
//       console.warn("Phone number not found in token. Token payload:", decoded)
//       return null
//     } catch (error) {
//       console.error("Error extracting phone number:", error)
//       return null
//     }
//   }
  
//   /**
//    * Check if a token is expired
//    */
//   export function isTokenExpired(token: string): boolean {
//     try {
//       const decoded = decodeToken(token)
//       if (!decoded.exp) return true
  
//       // exp is in seconds, Date.now() is in milliseconds
//       return decoded.exp * 1000 < Date.now()
//     } catch (error) {
//       console.error("Error checking token expiration:", error)
//       return true
//     }
//   }
  


// Token utilities for decoding JWT tokens

interface DecodedToken {
    userId?: string
    sub?: string
    id?: string
    user?: {
      id?: string
    }
    exp?: number
    iat?: number
    [key: string]: any
  }
  
  /**
   * Decode a JWT token to extract its payload
   */
  export function decodeToken(token: string): DecodedToken {
    try {
      // Split the token into parts
      const parts = token.split(".")
  
      if (parts.length !== 3) {
        console.error("Invalid token format")
        return {}
      }
  
      // Decode the payload (second part)
      const payload = parts[1]
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
  
      // Add padding if needed
      const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
  
      // Decode base64
      const jsonPayload = atob(paddedBase64)
  
      // Parse JSON
      const decoded = JSON.parse(jsonPayload)
      console.log("Decoded token payload:", decoded)
  
      return decoded
    } catch (error) {
      console.error("Error decoding token:", error)
      return {}
    }
  }
  
  /**
   * Extract userId from a decoded token
   */
  export function extractUserId(token: string): string | null {
    try {
      const decoded = decodeToken(token)
      console.log("Looking for userId in decoded token:", decoded)
  
      // Look for userId in various possible locations in the token
      let userId = null
  
      // Direct properties
      if (decoded.userId) {
        userId = decoded.userId
      } else if (decoded.sub) {
        userId = decoded.sub
      } else if (decoded.id) {
        userId = decoded.id
      }
      // Check in user object if it exists
      else if (decoded.user && typeof decoded.user === "object") {
        if (decoded.user.id) {
          userId = decoded.user.id
        }
      }
  
      if (userId) {
        console.log("Found userId in token:", userId)
        return userId
      }
  
      // If we can't find a userId field, log the issue
      console.warn("UserId not found in token. Token payload:", decoded)
      return null
    } catch (error) {
      console.error("Error extracting userId:", error)
      return null
    }
  }
  
  /**
   * Extract phone number from userId
   * This function assumes the userId contains or encodes the phone number
   */
  export function extractPhoneNumberFromUserId(userId: string): string | null {
    if (!userId) return null
  
    try {
      console.log("Extracting phone number from userId:", userId)
  
      // Check if userId is a phone number itself (starts with + or contains only digits)
      if (userId.startsWith("+") || /^\d+$/.test(userId)) {
        return userId
      }
  
      // Check if userId contains a phone number pattern
      const phonePattern = /(\+\d{1,3}\d{9,12})|(\d{10,15})/
      const match = userId.match(phonePattern)
      if (match && match[0]) {
        return match[0]
      }
  
      // If userId is a base64 encoded string, try to decode it
      try {
        // Check if it looks like base64
        if (/^[A-Za-z0-9+/=]+$/.test(userId)) {
          const decoded = atob(userId)
          // Check if decoded string contains a phone number
          const decodedMatch = decoded.match(phonePattern)
          if (decodedMatch && decodedMatch[0]) {
            return decodedMatch[0]
          }
        }
      } catch (e) {
        // Not base64, continue with other methods
      }
  
      // If userId is a JSON string, try to parse it
      try {
        if (userId.startsWith("{") && userId.endsWith("}")) {
          const parsed = JSON.parse(userId)
          if (parsed.phoneNumber) return parsed.phoneNumber
          if (parsed.phone) return parsed.phone
        }
      } catch (e) {
        // Not JSON, continue with other methods
      }
  
      console.warn("Could not extract phone number from userId:", userId)
      return null
    } catch (error) {
      console.error("Error extracting phone number from userId:", error)
      return null
    }
  }
  
  /**
   * Extract phone number from a token by first getting the userId and then extracting from it
   */
  export function extractPhoneNumber(token: string): string | null {
    const userId = extractUserId(token)
    if (!userId) {
      console.error("Could not extract userId from token")
      return null
    }
  
    return extractPhoneNumberFromUserId(userId)
  }
  
  /**
   * Check if a token is expired
   */
  export function isTokenExpired(token: string): boolean {
    try {
      const decoded = decodeToken(token)
      if (!decoded.exp) return true
  
      // exp is in seconds, Date.now() is in milliseconds
      return decoded.exp * 1000 < Date.now()
    } catch (error) {
      console.error("Error checking token expiration:", error)
      return true
    }
  }
  