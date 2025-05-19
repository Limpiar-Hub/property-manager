"use client"

import RegistrationSuccess from "@/cleaningBusiness/component/steps/registration-success"
import Logo from "@/cleaningBusiness/component/logo"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center my-8">
          <Logo />
        </div>

        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
          <RegistrationSuccess />
        </div>
      </div>
    </div>
  )
}
