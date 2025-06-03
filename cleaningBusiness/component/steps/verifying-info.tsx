"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

export default function VerifyingInfo() {
  const router = useRouter()
  const registrationStatus = useSelector((state: any) => state.form.data.registrationStatus)
  const registrationError = useSelector((state: any) => state.form.data.registrationError)

  useEffect(() => {
    // If there's an error, we'll show it in this component
    // If registration is successful, we'll redirect to success page after a delay
    if (registrationStatus === "success") {
      const timer = setTimeout(() => {
        router.push("/partner/registration-success")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [registrationStatus, router])

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {registrationStatus === "loading" && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <h1 className="text-3xl font-semibold mb-4">Verifying your Info...</h1>
          <p className="text-gray-500 text-center max-w-md">Please wait while we process your registration.</p>
        </>
      )}

      {registrationStatus === "error" && (
        <>
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold mb-4">Registration Failed</h1>
          <p className="text-red-500 text-center max-w-md">
            {registrationError || "There was an error processing your registration. Please try again."}
          </p>
        </>
      )}

      {registrationStatus === "success" && (
        <>
          <div className="animate-pulse text-green-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold mb-4">Registration Successful!</h1>
          <p className="text-gray-500 text-center max-w-md">
            Your information has been verified. Redirecting to login...
          </p>
        </>
      )}
    </div>
  )
}
