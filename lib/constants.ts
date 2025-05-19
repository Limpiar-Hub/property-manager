export const API_BASE_URL = "https://limpiar-backend.onrender.com/api"

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  PROPERTY_MANAGER: "property_manager",
  CLEANING_BUSINESS: "cleaning_business",
  CLEANER: "cleaner",
}

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
}

// Property statuses
export const PROPERTY_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
}

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/admin/log-in",
  SIGNUP: "/admin/sign-up",
  VERIFY: "/admin/verify",
  ANALYTICS: "/admin/analytics",
  FORGOT_PASSWORD: "/admin/forgot-password",
  CHECK_EMAIL: "/admin/check-email",
  DASHBOARD: "/admin/dashboard",
  USERS: "/admin/users",
  PROPERTIES: "/admin/property",
  BOOKINGS: "/admin/booking",
  CLEANING_BUSINESSES: "/admin/cleaning-business",
  PAYMENTS: "/admin/payment",
  SETTINGS: "/admin/settings",
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  PHONE_NUMBER: "phoneNumber",
  REMEMBERED_EMAIL: "rememberedEmail",
  RESET_EMAIL: "resetEmail",
}

