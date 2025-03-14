"use client"

// import { Logo } from "@/components/ui/logo"
import { CheckCircle } from "lucide-react"
import { useDispatch } from "react-redux"
import { resetOnboarding } from "@/redux/features/onboarding/onboardingSlice"

export default function SuccessPage() {
  const dispatch = useDispatch()

  const handleGoHome = () => {
    // Reset the onboarding state when going home
    dispatch(resetOnboarding())
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-12">
            {/* <Logo /> */}
          </div>

          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Submission Received Successfully!</h1>

          <p className="text-gray-600 mb-8 max-w-md">
            Thank you for submitting your details. Our team has received your information and will review it shortly. An
            administrator will reach out to you for any additional documentation required to complete the process. We
            appreciate your cooperation and look forward to assisting you further.
          </p>

          <button
            onClick={handleGoHome}
            className="w-full bg-[#2e7eea] text-white py-3 px-4 rounded-md hover:bg-[#2569d0] transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

