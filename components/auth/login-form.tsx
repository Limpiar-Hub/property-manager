
"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { loginStart, loginSuccess } from "@/redux/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  code: z.string().min(1, "Reset code is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface DecodedToken {
  userId: string;
  role?: string;
  [key: string]: any;
}

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(!!searchParams.get("userId"));

  React.useEffect(() => {
    setIsResetPassword(!!searchParams.get("userId"));
  }, [searchParams]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      if (!responseData.token) {
        throw new Error("No token received");
      }

      const decodedToken: DecodedToken = jwtDecode(responseData.token);
      const userId = decodedToken.userId;
      const role = decodedToken.role;

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      if (!role) {
        throw new Error("Role not found in token");
      }

      if (role !== "property_manager") {
        throw new Error("Unauthorized Access: Only property managers are allowed");
      }

      dispatch(loginSuccess({ token: responseData.token }));

      if (responseData.message === "Verify your phone number.") {
        router.push("/verify-otp");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      dispatch(loginStart());
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send reset code");
      }

      if (!responseData.userId) {
        throw new Error("User ID not found in response");
      }

      localStorage.setItem("userId", responseData.userId);

      alert("Reset Password Request Sent: Please check your email for the reset code.");
      setIsForgotPassword(false);
      setIsResetPassword(true);
      router.push(`/login?userId=${responseData.userId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId") || searchParams.get("userId");
      if (!userId) {
        throw new Error("User ID is missing from your session");
      }

      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: data.code,
          newPassword: data.newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to reset password");
      }

      alert("Password Reset Successful: Please log in with your new password.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsResetPassword(false);
      setIsForgotPassword(false);
      router.push("/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/authLoggo.png"
          alt="Limpiar Logo"
          width={200}
          height={200}
        />
      </div>
      <h2 className="mt-6 text-2xl font-bold">
        {isResetPassword ? "Reset Password" : isForgotPassword ? "Forgot Password" : "Sign in"}
      </h2>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      {isResetPassword ? (
        <form onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Reset Code</Label>
              <Input
                id="code"
                placeholder="Enter reset code"
                className={`w-full p-3 border ${
                  resetPasswordForm.formState.errors.code ? "border-red-500" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...resetPasswordForm.register("code")}
              />
              {resetPasswordForm.formState.errors.code && (
                <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.code.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-3 border ${
                    resetPasswordForm.formState.errors.newPassword ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                  {...resetPasswordForm.register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {resetPasswordForm.formState.errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsResetPassword(false);
                setIsForgotPassword(false);
                router.push("/login");
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              Back to Sign in
            </button>
          </div>
        </form>
      ) : isForgotPassword ? (
        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPasswordSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="forgotEmail">Email Address</Label>
              <Input
                id="forgotEmail"
                type="email"
                placeholder="hello@example.com"
                className={`w-full p-3 border ${
                  forgotPasswordForm.formState.errors.email ? "border-red-500" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...forgotPasswordForm.register("email")}
              />
              {forgotPasswordForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{forgotPasswordForm.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Code...
              </>
            ) : (
              "Send Reset Code"
            )}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                router.push("/login");
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              Back to Sign in
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                className={`w-full p-3 border ${
                  loginForm.formState.errors.email ? "border-red-500" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...loginForm.register("email")}
              />
              {resetPasswordForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-3 border ${
                    loginForm.formState.errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                  {...loginForm.register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {resetPasswordForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm">
                Keep me signed in
              </Label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Forgot Password?
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <div className="text-center text-sm">
  If you don't have an account,{" "}
  <a href="https://api.leadconnectorhq.com/widget/booking/N59Uzph3F1P9QB1CfZLS" className="text-blue-500 hover:text-blue-600 font-semibold">
    click here to join the Limpiar community →
  </a>
</div>
        </form>
      )}
    </div>
  );
}
