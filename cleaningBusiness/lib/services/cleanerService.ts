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

export interface Cleaner {
    _id: string
    fullName: string
    phoneNumber: string
    email: string
    worker_id: string
    role: string
    availability: boolean
    identityVerified: boolean
    tasks: any[]


    createdAt: string; 
    updatedAt: string;

  }

  export interface CleaningBusiness {
    _id: string
    fullName: string
    email: string
    phoneNumber: string
    role: string
    isVerified: boolean
    status: string
    businessInfo: {
      address: string
      city: string
      state: string
      zipCode: string
      website: string
      referenceSource: string
      howManyTeamMembersDoYouHave: number
      operatingCity: string
      servicesYouProvide: string[]
    }
    assignedProperties: any[]
    availability: boolean
    onboardingChecklist: boolean
    tasks: any[]
    settings: {
      accessControl: {
        canEdit: boolean
        canDelete: boolean
        canAdd: boolean
      }
    }
    cleaners: Cleaner[]
    createdAt: string
    updatedAt: string
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


export async function fetchCleaners(businessId: string, token: string): Promise<CleaningBusiness> {
    const response = await fetch(`${API_BASE_URL}/users/cleaning-business/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch cleaners")
    }
  
    return response.json()
  }