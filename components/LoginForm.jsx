"use client";

// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
// import { Sidebar } from "@/components/sidebar-stepper";
// import StepForm from "@/components/MultiStepForm/StepForm";
import { useForm } from "react-hook-form";
import Image from "next/image"; 
import { PasswordInput } from "@/components/password-input";
// import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

// const SuccessPage = dynamic(() => import("@/components/SuccessPage"), { 
//   ssr: false,
// });

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm();

      const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleLoading = () =>{
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/verifylogin-otp');
        }, 3000)
    }
//   const { currentStep, showOtpVerification, showSuccess } = useSelector(
//     (state: RootState) => state.onboarding
//   );

    // If showing success page, render it as a standalone page
//     if (showSuccess) {
//       return <SuccessPage />
//     }

//   // If showing OTP verification, render a centered layout
//   if (showOtpVerification) {
//     return <StepForm />;
//   }

  // Otherwise, render the standard layout with sidebar
  return (
    <div className="relative flex-1 p-6 md:p-10 flex flex-col w-[50%]">
        <div className="items-start flex flex-col justify-baseline">
            <h1 className="font-medium text-4xl pb-6">Sign In</h1>
            <div className="w-full space-y-4">
                <div className="space-y-1">
                    <label htmlFor='email' className="block text-base font-medium">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                        id='email'
                        type='email'
                        placeholder='hello@email.com'
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e7eea] focus:border-transparent pr-10`}
                        />
                    </div>
                </div>
                <PasswordInput
                    id="password"
                    label="Password"
                    register={register("password")} 
                />
                <div>
                    <input type="checkbox" id="keep me signed in" name="keep me signed in" value="keep me signed in" /> 
                    <label htmlFor="keep me signed in" className=" text-sm"> Keep me signed in</label>

                    <a className="pl-20 text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">Forgot Password?</a>
                </div>
                <button
                    type="button" onClick={() => handleLoading()}
                    className="relative bg-[#0082ED] w-full h-10 top-1/2 mt-14 transform -translate-y-1/2 text-white rounded-md"
                    // onClick={() => setShowPassword(!showPassword)}
                    >
                        {isLoading ? "Signing In..." : "Next"}
                </button>
                <span className="items-center flex justify-center">If you dont have an account <a className="pl-2 underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"> Sign Up</a></span>
            </div>
        </div>
    </div>
  );
}
