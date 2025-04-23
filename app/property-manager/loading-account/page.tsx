"use client"

import { useAppSelector } from "@/hooks/useReduxHooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image";

export default function LoadingAccountPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/property-manager/login")
      return
    }

    // Simulate loading and redirect to dashboard
    const timer = setTimeout(() => {
      router.push("/property-manager/my-property")
    }, 2000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">

        <Image
        src="/authLoggo.png"
        alt="Limpiar Logo"
        width={200}
        height={200}
        className="mx-auto "
      />
        <h2 className="mt-12 text-xl font-normal text-gray-500">Loading your account...</h2>
      </div>
    </div>
  )
}

