"use client";

// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
// import { Sidebar } from "@/components/sidebar-stepper";
// import StepForm from "@/components/MultiStepForm/StepForm";
import { useForm } from "react-hook-form";
import Image from "next/image"; 
import { PasswordInput } from "@/components/password-input";
// import dynamic from "next/dynamic";

// const SuccessPage = dynamic(() => import("@/components/SuccessPage"), {
//   ssr: false,
// });

export default function OtpInput() {
    const inputs = document.getElementById("inputs");

    if (inputs) {
    inputs?.addEventListener("input", function (e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target?.value;

        if (isNaN(Number(val)) && target) {
            target.value = "";
            return;
        }

        if (val != "") {
            const next = target?.nextElementSibling as HTMLInputElement;
            if (next) {
                next.focus();
            }
        }
    });

    inputs?.addEventListener("keyup", function (e: KeyboardEvent) {
        const target = e.target as HTMLButtonElement;
        const key = e.key.toLowerCase();

        if (key == "backspace" || key == "delete") {
            if(target) {
                target.value = "";
                const prev = target?.previousElementSibling as HTMLInputElement;
                if (prev) {
                    prev.focus();
                }
                return;
            }
        }
    });
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
    <div className="relative flex-1 p-6 md:p-10 flex flex-col w-full">
        <div className="items-start flex flex-col justify-baseline space-y-4">
            <h1 className="font-medium text-4xl pb-6">Enter OTP Code</h1>
            <p>Enter the one time code sendt to <span className="font-bold">+2349128943518</span> to confirm your account and start with limpair</p>
            <div className="w-full">
                <div className="flex justify-center items-center">
                    <div id="inputs" className="space-x-3 relative right-7">
                        <input className="w-9 h-9 border-2 rounded-md nth-[1]:cursor-pointer placeholder:text-[#E7E8E9] pointer-events-auto  border-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />

                        <input className="w-9 h-9 border-2 text- rounded-md placeholder:text-[#E7E8E9] border-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed pointer-events-none" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />

                        <input className="w-9 h-9 border-2 rounded-md border-[#E7E8E9] placeholder:text-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed pointer-events-none" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />

                        <input className="w-9 h-9 border-2 rounded-md border-[#E7E8E9] placeholder:text-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed pointer-events-none" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />

                        <input className="w-9 h-9 border-2 rounded-md border-[#E7E8E9] placeholder:text-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed pointer-events-none" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />

                        <input className="w-9 h-9 border-2 rounded-md border-[#E7E8E9] placeholder:text-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl cursor-not-allowed pointer-events-none" type="text" placeholder="0"
                            inputMode="numeric" maxLength={1} />
                    </div>
                </div>
                <button
                    type="button"
                    className="relative bg-[#0082ED] w-full h-10 top-1/2 mt-14 transform -translate-y-1/2 text-white rounded-md"
                    // onClick={() => setShowPassword(!showPassword)}
                    >
                        Confirm
                </button>
                <span className="items-center flex justify-center">Resend code in 60s</span>
            </div>
        </div>
    </div>
  );
}
