"use client"

import type React from "react"
import Image from "next/image";
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAppDispatch } from "@/hooks/useReduxHooks"
import { loginStart, loginSuccess } from "@/redux/features/auth/authSlice"
// import { LimpiarLogo } from "@/components/ui/limpiar-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setIsLoading(true)
      dispatch(loginStart())

      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (data.message === "Verify your phone number." && data.token) {
        // Store token in Redux
        dispatch(loginSuccess({ token: data.token }))

        // Redirect to OTP verification page
        router.push("/cleaning-business/verify-otp")
      } else {
        throw new Error("Unexpected response from server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      dispatch(loginStart())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center justify-center">
        {/* <LimpiarLogo className="h-16 w-auto" /> */}
        <Image
            src="/cleaningBusinessLogo.png"
            alt="Limpiar Logo"
            width={200}
            height={200}
            // className="h-10 w-auto"
          />
      
      </div>
      <h2 className="mt-6 text-2xl font-bold">Sign in</h2>


      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm">
              Keep me signed in
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="text-[#4C41C0] hover:text-blue-600">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#4C41C0] hover:bg-[#4C41C9]" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login"}
        </Button>

        <div className="text-center text-sm">
          If you don&apos;t have an account{" "}
          <Link href="/signup" className="text-[#4C41C0] hover:text-blue-600">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}

