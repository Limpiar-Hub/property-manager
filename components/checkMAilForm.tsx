"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from "next/navigation"

export function CheckEmailForm() {
    const router = useRouter()
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const getuser = localStorage.getItem('persist:auth');
    let user: any;
    let token: string;
    if(getuser) {
      token = JSON.parse(JSON.parse(getuser).token);
      user = JSON.parse(JSON.parse(getuser).user)
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    const userId = user._id;

    try {
        // TODO: Update this with the correct API call once we have more information
        const response = await fetch("https://limpiar-backend.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),  // wrap in an object
        })

        const data = await response.json();

        if (response.ok) {
        setStatus("success")
        // router.push("/check-email");
        console.log({success: data.success, message: data.message})
        } else {
        throw new Error("Password reset request failed")
        }
    } catch (err) {
        console.error("Password reset error:", err);
        setStatus("idle");
    }
    }
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email for password reset link</h1>
        <p className="text-muted-foreground">
          Password reset link has been sent to the email associated with your account.
        </p>
      </div>
      <div className="space-y-4">
        <Button
        onClick={handleSubmit}
            className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90"
            disabled={status === "loading" || status === "success"}
        >
            {status === "loading" ? "Sending..." : "Send reset link"}
        </Button>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">
            Re-enter email
          </Button>
        </Link>
      </div>
      <div className="text-center">
        <Button onClick={() => router.push("/reset-password")} className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90">
            Proceed
        </Button>
      </div>
    </div>
  )
}

