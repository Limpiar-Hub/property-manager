"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { logout } from "@/redux/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ResetPasswordFormProps {
  token: string
}

export function ChangePasswordForm() {
    const getuser = localStorage.getItem('persist:auth');
    const dispatch = useAppDispatch();
    
    let user: any;
    let token: string;
    if(getuser) {
        token = JSON.parse(JSON.parse(getuser).token);
        user = JSON.parse(JSON.parse(getuser).user)
    }

  const router = useRouter()
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
    currentPassword: ""
  })
  const [code, setCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle")

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasThreeNumbers = (password.match(/\d/g) || []).length >= 3
    return { hasMinLength, hasSpecialChar, hasThreeNumbers }
  }
    const handleLogout = () => {
      dispatch(logout());
      router.push("/login"); // Redirect to login page after logout
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const validation = validatePassword(formData.password)
    if (!validation.hasMinLength || !validation.hasSpecialChar || !validation.hasThreeNumbers) {
      setError("Password does not meet requirements")
      return
    }
    setStatus("loading");
    const body = {
        userId: user._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.password
    }
    try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/auth/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),  // wrap in an object
        });

        const result = await response.json();

        if (response.ok) {
        setStatus("success");
        console.log(result);
        setTimeout(() => handleLogout(), 1500);
        return;
      } else {
        setError(result.message)
        setStatus("idle")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setStatus("idle")
      console.log(err);
    }
  }

  const validation = validatePassword(formData.password)

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentpassword"
              type={showPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <div className={validation.hasMinLength ? "text-green-500" : ""}>✓ Min 8 characters</div>
            <div className={validation.hasSpecialChar ? "text-green-500" : ""}>✓ 1 special character</div>
            <div className={validation.hasThreeNumbers ? "text-green-500" : ""}>✓ 3 numbers</div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {status === "success" && (
          <p className="text-sm text-green-500 text-center">Password change successful. Redirecting to login...</p>
        )}
        <Button
          type="submit"
          className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Changing..." : "Change Password"}
        </Button>

        <Button onClick={() => router.back()} variant="outline" className="w-full">
        Go back
        </Button>

      </form>
    </div>
  )
}

