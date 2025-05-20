const API_BASE_URL = "https://limpiar-backend.onrender.com/api"

export interface CleanerFormData {
  fullName: string
  email: string
  phoneNumber: string
  cleaningBusinessId: string
  role: string
}

export interface CleanerResponse {
  success: boolean
  message: string
  worker_id: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  cleaningBusinessId: string
  verificationLink: string
}

export async function addCleaner(formData: CleanerFormData, token: string): Promise<CleanerResponse> {
  const response = await fetch(`${API_BASE_URL}/cleaners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to add cleaner")
  }

  return response.json()
}
