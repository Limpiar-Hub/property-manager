export interface Person {
    name: string
    image: string
  }
  
  export interface Cleaner extends Person {
    id: number
    title: string
    status: "active" | "inactive"
    image: string
  }
  
  export interface Task {
    id: number
    serviceType: string
    property: string
    propertyManager: Person
    date: string
    time: string
    notes: string
    status: "Pending" | "Not Started" | "In Progress" | "Delayed" | "Paused" | "Completed" | "Cancelled"
    assignedTo: Cleaner | null
    isConfirmed: boolean
  }
  