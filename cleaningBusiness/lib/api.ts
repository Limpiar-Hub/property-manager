// API service for handling all API requests
const API_BASE_URL = "https://limpiar-backend.onrender.com/api"

export async function registerBusiness(formData: any) {
  console.log("Registering business with data:", formData)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register-cleaning-business`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
    console.log("Registration response:", data)

    if (!response.ok) {
      throw new Error(data.message || "Registration failed")
    }

    return data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  console.log("Logging in with credentials:", credentials)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    console.log("Login response:", data)

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function verifyOtp(verificationData: { phoneNumber: string; code: string }, token: string) {
  console.log("Verifying OTP with data:", verificationData)
  console.log("Using token:", token)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(verificationData),
    })

    const data = await response.json()
    console.log("OTP verification response:", data)

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed")
    }

    return data
  } catch (error) {
    console.error("OTP verification error:", error)
    throw error
  }
}
