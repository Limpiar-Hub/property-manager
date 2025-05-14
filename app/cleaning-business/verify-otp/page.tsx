"use client";

import { OtpVerificationForm } from "@/cleaningBusiness/component/auth/otp-verification-form";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyOtpPage() {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      router.push("/cleaning-business/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <OtpVerificationForm />
    </div>
  );
}
