"use client";

import { useEffect } from "react";

export default function OtpInput() {
    useEffect(() => {
        const inputsContainer = document.getElementById("inputs");
        
        if (!inputsContainer) {
            console.error("Element with ID 'inputs' not found.");
            return;
        }

        const inputs = inputsContainer.querySelectorAll("input");

        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                const target = e.target as HTMLInputElement;
                const val = target.value;

                if (isNaN(Number(val))) {
                    target.value = "";
                    return;
                }

                if (val !== "" && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && index > 0) {
                    inputs[index].value = "";
                    inputs[index - 1].focus();
                }
            });
        });

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener("input", () => {});
                input.removeEventListener("keydown", () => {});
            });
        };
    }, []);

    return (
        <div className="relative flex-1 p-6 md:p-10 flex flex-col w-full">
            <div className="items-start flex flex-col justify-baseline space-y-4">
                <h1 className="font-medium text-4xl pb-6">Enter OTP Code</h1>
                <p>
                    Enter the one-time code sent to{" "}
                    <span className="font-bold">+2349128943518</span> to confirm your account.
                </p>
                <div className="w-full">
                    <div className="flex justify-center items-center">
                        <div id="inputs" className="space-x-3">
                            {Array(6)
                                .fill("")
                                .map((_, index) => (
                                    <input
                                        key={index}
                                        className="w-9 h-9 border-2 rounded-md border-[#E7E8E9] bg-[#F9F9F9] text-center text-4xl"
                                        type="text"
                                        placeholder="0"
                                        inputMode="numeric"
                                        maxLength={1}
                                    />
                                ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="bg-[#0082ED] w-full h-10 mt-14 text-white rounded-md"
                    >
                        Confirm
                    </button>
                    <span className="items-center flex justify-center">Resend code in 60s</span>
                </div>
            </div>
        </div>
    );
}
