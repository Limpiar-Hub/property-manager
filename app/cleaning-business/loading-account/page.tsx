"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/cleaningBusiness/component/logo"

export default function LoadingAccount() {
  const router = useRouter()

  useEffect(() => {
    // Simulate loading and redirect to dashboard
    const timer = setTimeout(() => {
      router.push("/cleaning-business/dashboard")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h1 className="text-2xl text-gray-500 mb-8">Loading your account...</h1>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  )
}
