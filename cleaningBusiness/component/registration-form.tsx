"use client"
import { useSelector } from "react-redux"
import Image from "next/image"
import { Provider } from "react-redux"
import { store } from "../lib/store"
import BusinessInformation from "./steps/business-information"
import ContactInformation from "./steps/contact-information"
import OperatingInformation from "./steps/operating-information"
import VerifyingInfo from "./steps/verifying-info"
import RegistrationSuccess from "./steps/registration-success"
import StepIndicator from "./step-indicator"
import Logo from "./logo"

// Wrapper component to provide Redux store
const RegistrationFormWithProvider = () => {
  return (
    <Provider store={store}>
      <RegistrationFormContent />
    </Provider>
  )
}

const RegistrationFormContent = () => {
  const currentStep = useSelector((state: any) => state.form.currentStep)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-center mb-8">
      <Image
            src="/cleaningBusinessLogo.png"
            alt="Limpiar Logo"
            width={120}
            height={50}
            className="h-10 w-auto"
          />
      </div>

      {currentStep < 4 && <StepIndicator />}

      <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
        {currentStep === 1 && <BusinessInformation />}
        {currentStep === 2 && <ContactInformation />}
        {currentStep === 3 && <OperatingInformation />}
        {currentStep === 4 && <VerifyingInfo />}
        {currentStep === 5 && <RegistrationSuccess />}
      </div>
    </div>
  )
}

export default RegistrationFormWithProvider
