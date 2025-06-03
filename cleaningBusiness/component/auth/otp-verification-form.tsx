"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { verifyOtp, getUserData } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";

export function OtpVerificationForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { token, user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      router.push("/partner/login");
    }
  }, [token, router]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (token) {
      dispatch(getUserData(token));
    }
  }, [token, dispatch]);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (value && /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (index < 5 && value) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const newOtp = [...otp];

      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData.charAt(i);
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Extract phone number from the JWT token if user object doesn't have it yet
  const getPhoneNumber = (): string | undefined => {
    if (user?.phoneNumber) {
      return user.phoneNumber;
    }

    // The updated auth slice should already have the phone number from the JWT
    // but this is a fallback in case it doesn't
    return undefined;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    const phoneNumber = getPhoneNumber();

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!phoneNumber) {
      setError("Phone number not found. Please try logging in again.");
      return;
    }

    try {
      await dispatch(
        verifyOtp({
          phoneNumber,
          code: otpCode,
        })
      ).unwrap();

      // If we got here, verification was successful
      router.push("/partner/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      setError("");

      // Implement resend code logic here
      // This would typically call an API endpoint to resend the OTP
      // await dispatch(resendOtp({ phoneNumber: getPhoneNumber() })).unwrap();

      setCountdown(60);
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "your phone";

    // Show last 4 digits, mask the rest
    const lastFourDigits = phone.slice(-4);
    return `***-***-${lastFourDigits}`;
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <Image
        src="/cleaningBusinessLogo.png"
        alt="Limpiar Logo"
        width={200}
        height={200}
        className="mx-auto "
      />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Enter OTP Code</h2>
        <p className="text-sm text-gray-500">
          Enter the one-time code sent to {formatPhoneNumber(getPhoneNumber())}{" "}
          to confirm your account and start with Limpiar
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-12 w-12 rounded-md border border-gray-300 text-center text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4C41C0] hover:bg-[#4C41C9]"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Confirm"}
        </Button>
      </form>

      <button
        type="button"
        onClick={handleResendCode}
        disabled={countdown > 0 || isResending}
        className="text-sm text-[#4C41C0] hover:text-[#4C41C9] disabled:text-gray-400"
      >
        {countdown > 0
          ? `Resend code in ${countdown}s`
          : isResending
          ? "Sending..."
          : "Resend code"}
      </button>
    </div>
  );
}