const API_BASE_URL = "https://limpiar-backend.onrender.com/api"


export interface Booking {
  cleanerId: any
  assignedCleaner: any
    _id: string
    propertyId?: {
      _id: string
      name: string
      address: string

    }
    propertyManagerId?: {
      _id: string
      fullName: string

    }
    cleaningBusinessId: string
    phoneNumber: string
    date: string
    startTime: string
    endTime: string
    serviceType: string
    price: number
    status: string
      assignedTo?: {
    _id: string
    fullName: string
    image?: string
  } | null
    uuid: string
    createdAt: string
    updatedAt: string

  }

export interface AssignCleanerRequest {
  bookingId: string
  cleanerId: string
}

export async function fetchBookingDetails(bookingId: string, token: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch booking details")
    }
  
    const result = await response.json()
    return result.data 
  }



export async function assignCleanerToTask(data: AssignCleanerRequest, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/bookings/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to assign cleaner to task")
  }

  return response.json()
}

export async function reAssignCleanerToTask(data: AssignCleanerRequest, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cleaners/tasks/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to assign cleaner to task")
    }
  
    return response.json()
  }
