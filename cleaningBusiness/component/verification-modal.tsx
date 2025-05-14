"use client"

import { useRouter } from "next/navigation"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const router = useRouter()

  const handleGoToCleaners = () => {
    onClose()
    router.push("/cleaners")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your Info...</h2>
        <p className="text-gray-600 mb-6">
          Once your information is verified the cleaner will be onboarded and provided with login details.
        </p>
        <button
          onClick={handleGoToCleaners}
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Go to Cleaners
        </button>
      </div>
    </div>
  )
}
