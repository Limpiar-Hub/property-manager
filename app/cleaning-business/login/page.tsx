// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useDispatch } from "react-redux"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import Link from "next/link"
// import { Eye, EyeOff } from "lucide-react"
// import { loginUser } from "../../../cleaningBusiness/lib/api"
// import { loginStart, loginSuccess, loginFailure } from "../../../cleaningBusiness/lib/features/form/formSlice"
// import Logo from "../../../cleaningBusiness/component/logo"

// export default function LoginPage() {
//   const router = useRouter()
//   const dispatch = useDispatch()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [rememberMe, setRememberMe] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLoading(true)
//     dispatch(loginStart())

//     try {
//       const response = await loginUser({ email, password })
//       console.log("Login successful:", response)

//       // Extract userId and token from response
//       const { userId, token } = response

//       // Extract phone number from userId (assuming it's encoded in the userId)
//       // This is a placeholder - you might need to adjust based on actual response format
//       const phoneNumber = extractPhoneNumber(userId)

//       // Store in localStorage
//       localStorage.setItem("token", token)
//       localStorage.setItem("userId", userId)
//       localStorage.setItem("phoneNumber", phoneNumber)

//       // Update Redux state
//       dispatch(loginSuccess({ token, userId, phoneNumber }))

//       // Redirect to OTP verification
//       router.push("/cleaning-business/verify-otp")
//     } catch (error) {
//       console.error("Login error:", error)
//       setError((error as Error).message || "Login failed. Please check your credentials.")
//       dispatch(loginFailure((error as Error).message))
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Placeholder function to extract phone number from userId
//   // You might need to adjust this based on your actual implementation
//   const extractPhoneNumber = (userId: string): string => {
//     // This is a placeholder - in a real app, you might decode a JWT or use another method
//     // to extract the phone number from the userId or token
//     console.log("Extracting phone number from userId:", userId)

//     // For demo purposes, return a hardcoded phone number
//     // In a real app, you would extract this from the response
//     return "+2347080772205"
//   }

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword)
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md mx-auto">
//         <div className="flex justify-center mb-8">
//           <Logo />
//         </div>

//         <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
//           <h1 className="text-3xl font-semibold text-center mb-6">Sign in</h1>

//           {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="hello@example.com"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="remember"
//                   checked={rememberMe}
//                   onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                 />
//                 <Label htmlFor="remember" className="text-sm">
//                   Keep me signed in
//                 </Label>
//               </div>
//               <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
//                 Forgot Password?
//               </Link>
//             </div>

//             <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
//               {isLoading ? "Logging in..." : "Login"}
//             </Button>
//           </form>

//           <div className="text-center text-sm mt-6">
//             If you don't have an account{" "}
//             <Link href="/cleaning-business/sign-up" className="text-indigo-600 hover:underline">
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { LoginForm } from "@/cleaningBusiness/component/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}

