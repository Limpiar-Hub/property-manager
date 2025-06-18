"use client";
import { LoginForm } from "@/cleaningBusiness/component/auth/login-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
       <LoginForm />
      </Suspense>
    </div>
  );
}