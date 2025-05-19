import { useSelector } from "react-redux"

export default function StepIndicator() {
  const currentStep = useSelector((state: any) => state.form.currentStep)

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? "bg-indigo-600 text-white" : "text-gray-500"}`}
          >
            1
          </div>
          <div className={`ml-2 ${currentStep === 1 ? "text-black" : "text-gray-500"}`}>Business Information</div>
        </div>
        <div className="flex-1 mx-4 h-0.5 bg-gray-200">
          <div
            className={`h-full bg-indigo-600 ${currentStep >= 2 ? "w-full" : "w-0"} transition-all duration-300`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? "bg-indigo-600 text-white" : currentStep > 2 ? "text-gray-500" : "text-gray-300"}`}
          >
            2
          </div>
          <div
            className={`ml-2 ${currentStep === 2 ? "text-black" : currentStep > 2 ? "text-gray-500" : "text-gray-300"}`}
          >
            Primary Contact Details
          </div>
        </div>
        <div className="flex-1 mx-4 h-0.5 bg-gray-200">
          <div
            className={`h-full bg-indigo-600 ${currentStep >= 3 ? "w-full" : "w-0"} transition-all duration-300`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 3 ? "bg-indigo-600 text-white" : "text-gray-300"}`}
          >
            3
          </div>
          <div className={`ml-2 ${currentStep === 3 ? "text-black" : "text-gray-300"}`}>Operating Information</div>
        </div>
      </div>
    </div>
  )
}
