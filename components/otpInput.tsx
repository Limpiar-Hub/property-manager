"use client";

import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { setOtp } from "@/redux/features/login/loginSlice";


export default function OtpInput() {
    const dispatch = useAppDispatch()
    
    const { phoneNumber, otp } = useAppSelector((state) => state.login);
    const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));
    const [isveriying, setIsVerifying] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [countdown, setCountdown] = useState(60); // Countdown time in seconds
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<HTMLInputElement[]>([]); // Store input refs

    useEffect(() => {
        alert(`Your otp is ${otp}`)
        inputRefs.current[0]?.focus(); // Focus first input on mount

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; // Only allow digits (0-9)

        const newOtp = [...otpValue];
        newOtp[index] = value;
        setOtpValue(newOtp);

        // Move to next input if value exists
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 5) {
            setIsComplete(true);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpValue[index] && index > 0) {
            setIsComplete(false);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        setIsVerifying(true);
        setTimeout(() => {
            const enteredOtp = otpValue.join("");
            if (enteredOtp.length === 6) {
                setIsComplete(true);
                if (enteredOtp === otp.toString()) {
                    alert('OTP IS VERIFIED')
                } else {
                    alert('INVALID OTP')
                }
            }

            setIsVerifying(false);
        }, 5000);
    };

    const handleResendOtp = () => {
        dispatch(setOtp(Math.floor(100000 + Math.random() * 900000)));
        setCountdown(60);
        setCanResend(false);

        alert('Resending OTP');
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="relative flex-1 p-6 md:p-10 flex flex-col w-full">
            <div className="items-start flex flex-col space-y-4">
                <h1 className="font-medium text-4xl pb-6">Enter OTP Code</h1>
                <p>
                    Enter the one-time code sent to <span className="font-bold">{phoneNumber}</span> to confirm your account.
                </p>
                <div className="w-full flex justify-center items-center">
                    <div className="space-x-3" id="inputs">
                        {otpValue.map((val, index) => (
                            <input
                                key={index}
                                ref={(el) => {if (el) inputRefs.current[index] = el}}
                                className={`w-9 h-9 border-2 rounded-md ${isComplete ? 'border-[#01B750]' : 'border-[#E7E8E9]' } ${isComplete ? 'bg-[#EDFDF4]' : 'bg-[#F9F9F9]' } ${isComplete ? 'text-[#01B750]' : 'text-black' }  text-center text-4xl`} 
                                type="text"
                                value={val}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                inputMode="numeric"
                            />
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-[#0082ED] w-full h-10 mt-14 text-white rounded-md"
                >
                    {isveriying ? 'Verifying....' : 'Confirm'}
                </button>

                {canResend ? (
                    <button
                        onClick={handleResendOtp}
                        className="text-blue-500 font-semibold mt-4"
                    >
                        Resend OTP
                    </button>
                ) : (
                    <span className="flex justify-center mt-4">
                        Resend code in {countdown}s
                    </span>
                )}
            </div>
        </div>
    );
}
