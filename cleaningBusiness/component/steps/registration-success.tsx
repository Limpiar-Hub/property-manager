"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegistrationSuccess() {
  const router = useRouter()

  const handleProceedToLogin = () => {
    router.push("/partner/login")
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-green-500 mb-4">
        <CheckCircle size={64} />
      </div>
      <h1 className="text-3xl font-semibold mb-4">Registration Successful!</h1>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Your business has been successfully registered. You can now log in to access your account.
      </p>
      <Button onClick={handleProceedToLogin} className="bg-indigo-600 hover:bg-indigo-700">
        Proceed to Login
      </Button>
    </div>
  )
}
