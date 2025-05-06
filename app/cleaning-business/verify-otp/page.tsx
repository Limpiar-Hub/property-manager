// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { verifyOtp } from "@/cleaningBusiness/lib/api"
// import { getToken, getUserData, saveUserData, isAuthenticated } from "@/cleaningBusiness/lib/auth-storage"
// import Logo from "@/cleaningBusiness/component/logo"

// export default function VerifyOtpPage() {
//   const router = useRouter()

//   const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [countdown, setCountdown] = useState(60)
//   const [canResend, setCanResend] = useState(false)

//   const inputRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Get token and phone number
//   const [token, setToken] = useState<string | null>(null)
//   const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

//   useEffect(() => {
//     // Check if already fully authenticated
//     if (isAuthenticated()) {
//       const userData = getUserData()
//       if (userData && userData.isVerified) {
//         router.push("/cleaning-business/dashboard")
//         return
//       }
//     }

//     // Get token and user data
//     const storedToken = getToken()
//     const userData = getUserData()

//     // if (!storedToken) {
//     //   // No token, redirect to login
//     //   router.push("/cleaning-business/login")
//     //   return
//     // }

//     setToken(storedToken)

//     if (userData && userData.phoneNumber) {
//       setPhoneNumber(userData.phoneNumber)
//       console.log("Phone number for OTP verification:", userData.phoneNumber)
//     } else {
//       console.error("No phone number found in user data")
//       setError("Authentication error. Please log in again.")
//     }
//   }, [router])

//   // Countdown timer for resend code
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => {
//         setCountdown(countdown - 1)
//       }, 1000)
//       return () => clearTimeout(timer)
//     } else {
//       setCanResend(true)
//     }
//   }, [countdown])

//   // Handle OTP input change
//   const handleOtpChange = (index: number, value: string) => {
//     // Only allow numbers
//     if (value && !/^\d+$/.test(value)) return

//     const newOtpValues = [...otpValues]

//     // If pasting a full OTP code
//     if (value.length > 1) {
//       const pastedValues = value.split("").slice(0, 6)
//       for (let i = 0; i < pastedValues.length; i++) {
//         if (i + index < 6) {
//           newOtpValues[i + index] = pastedValues[i]
//         }
//       }
//       setOtpValues(newOtpValues)

//       // Focus on the last input or the next empty one
//       const nextIndex = Math.min(index + pastedValues.length, 5)
//       inputRefs.current[nextIndex]?.focus()
//       return
//     }

//     // Handle single digit input
//     newOtpValues[index] = value
//     setOtpValues(newOtpValues)

//     // Auto-focus next input if current one is filled
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   // Handle key press for backspace
//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace" && !otpValues[index] && index > 0) {
//       // Focus previous input when backspace is pressed on an empty input
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   // Handle OTP verification
//   const handleVerifyOtp = async () => {
//     const otpCode = otpValues.join("")

//     // Validate OTP code
//     if (otpCode.length !== 6) {
//       setError("Please enter a valid 6-digit code")
//       return
//     }

//     if (!phoneNumber || !token) {
//       setError("Missing authentication details. Please log in again.")
//       return
//     }

//     setError(null)
//     setIsLoading(true)

//     try {
//       const verificationData = {
//         phoneNumber,
//         code: otpCode,
//       }

//       console.log("Verifying OTP with:", verificationData)
//       console.log("Using token:", token)

//       const response = await verifyOtp(verificationData, token)
//       console.log("OTP verification successful:", response)

//       // Update user data to indicate verification is complete
//       const userData = getUserData() || {}
//       saveUserData({
//         ...userData,
//         isVerified: true,
//         // Add any additional user data from the response if needed
//         ...(response.userData || {}),
//       })

//       // Redirect to dashboard
//       router.push("/cleaning-business/dashboard")
//     } catch (error) {
//       console.error("OTP verification error:", error)
//       setError((error as Error).message || "Failed to verify OTP. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle resend code
//   const handleResendCode = () => {
//     // Reset countdown and disable resend button
//     setCountdown(60)
//     setCanResend(false)

//     // In a real app, you would call an API to resend the code
//     console.log("Resending code to:", phoneNumber)

//     // Show success message
//     setError(null)
//   }

//   // Format phone number for display (hide middle digits)
//   const formatPhoneNumber = (phone: string | null) => {
//     if (!phone) return "your phone"

//     const length = phone.length
//     if (length <= 7) return phone

//     const start = phone.substring(0, 3)
//     const end = phone.substring(length - 4)

//     return `${start}-***-${end}`
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md mx-auto">
//         <div className="flex justify-center mb-8">
//           <Logo />
//         </div>

//         <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
//           <h1 className="text-3xl font-semibold text-center mb-4">Enter OTP Code</h1>

//           <p className="text-center text-gray-500 mb-8">
//             Enter the one-time code sent to {formatPhoneNumber(phoneNumber)} to confirm your account and start with
//             Limpiar
//           </p>

//           {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

//           <div className="flex justify-between mb-8">
//             {otpValues.map((value, index) => (
//               <Input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={6}
//                 value={value}
//                 onChange={(e) => handleOtpChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-12 h-12 text-center text-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             ))}
//           </div>

//           <Button
//             onClick={handleVerifyOtp}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 mb-4"
//             disabled={isLoading || otpValues.join("").length !== 6}
//           >
//             {isLoading ? "Verifying..." : "Confirm"}
//           </Button>

//           <div className="text-center">
//             <button
//               type="button"
//               onClick={handleResendCode}
//               disabled={!canResend}
//               className={`text-sm ${canResend ? "text-indigo-600 hover:underline" : "text-gray-400"}`}
//             >
//               {canResend ? "Resend code" : `Resend code in ${countdown}s`}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client";

import { OtpVerificationForm } from "@/cleaningBusiness/component/auth/otp-verification-form";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyOtpPage() {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      router.push("/cleaning-business/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <OtpVerificationForm />
    </div>
  );
}
