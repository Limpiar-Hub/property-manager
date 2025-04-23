
export interface Property {
    _id: string;
    name: string;
    address: string;
    type: string;
    subType: string;
    size: string;
    status: string;
    images: string[];
  }
  
  export interface Cleaner {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
    avatar?: string;
  }
  
  export interface CleaningBusiness {
    _id: string;
    name?: string;
  }
  
  export interface Booking {
    _id: string;
    propertyId: Property;
    propertyManagerId: string;
    cleanerId: Cleaner | null;
    cleaningBusinessId: CleaningBusiness | null;
    phoneNumber: string;
    date: string;
    startTime: string;
    serviceType: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
  
  export interface TimelineEvent {
    date: string;
    time: string;
    event: string;
    icon: React.ReactNode;
    person?: {
      name: string;
      avatar?: string;
    };
    company?: string;
  }

  export type ServiceType = {
    id: string
    name: string
    price: string
    image: string
  }

  export type DateType = "one-time" | "multiple" | "routine"