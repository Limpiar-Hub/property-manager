"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"  
import { setStep } from "@/redux/features/addProperty/propertySlice"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function FormNavigation() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { step, category, subCategory, title } = useAppSelector((state) => state.property)

  const handleBack = () => {
    if (step === 1) {
      router.push("/my-property")
    } else if (step === 1.5) {
      dispatch(setStep(1))
    } else if (step === 2) {
      dispatch(setStep(1.5))
    } else {
      dispatch(setStep(step - 1))
    }
  }

  const handleNext = () => {
    if (step === 1) {
      dispatch(setStep(1.5)) // Go from category to subcategory
    } else if (step === 1.5) {
      dispatch(setStep(2)) // Go from subcategory to title
    } else {
      dispatch(setStep(step + 1)) // Handle other steps
    }
  }

  // Determine if the Next button should be enabled
  const isNextDisabled = () => {
    if (step === 1 && !category) return true
    if (step === 1.5 && !subCategory) return true
    if (step === 2 && !title.trim()) return true
    return false
  }

  return (
    <div className="flex justify-between items-center w-full mb-8">
      <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      <div>
        <button className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50">
          Save & Exit
        </button>
        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={cn(
            "px-4 py-2 rounded-md transition-colors",
            isNextDisabled()
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600",
          )}
        >
          Next
        </button>
      </div>
    </div>
  )
}

