"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaHeadset } from "react-icons/fa";
import type { RootState } from "@/redux/store";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentSuccessPage() {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId || !token) {
        setIsSuccess(false);
        toast.error("Missing payment session ID or authentication token.", {
          duration: 5000,
        });
        return;
      }

      try {
        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/payments/success/${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to verify payment.");
        }

        const data = await response.json();
        if (data.success) {
          setIsSuccess(true);
          toast.success("Payment successful! Your wallet has been updated.", {
            duration: 3000,
          });
          // Delay navigation to allow toast visibility
          setTimeout(() => {
            router.push("/payment");
          }, 3000);
        } else {
          throw new Error("Payment verification failed.");
        }
      } catch (err: any) {
        setIsSuccess(false);
        toast.error(err.message || "Failed to verify payment. Please contact support.", {
          duration: 5000,
        });
      }
    };

    verifyPayment();
  }, [token, router]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "12px",
          },
          success: {
            style: {
              borderColor: "#22c55e",
              color: "#166534",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              borderColor: "#ef4444",
              color: "#991b1b",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 border border-gray-200">
          {isSuccess === null ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="mt-4 text-lg font-medium text-gray-700">Verifying your payment...</p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center">
              <FaCheckCircle className="w-12 h-12 text-green-600" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">Payment Successful</h2>
              <p className="mt-2 text-gray-600 text-center">
                Your wallet has been updated. You will be redirected to the payment details page.
              </p>
              <button
                className="mt-6 flex flex-col items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                onClick={() => router.push("/payment")}
              >
                <FaEye className="w-5 h-5" />
                <span>View Payment Details</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FaTimesCircle className="w-12 h-12 text-red-600" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">Payment Failed</h2>
              <p className="mt-2 text-gray-600 text-center">
                Failed to verify payment. Please contact support for assistance.
              </p>
              <button
                className="mt-6 flex flex-col items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                onClick={() => router.push("/payment")}
              >
                <FaHeadset className="w-5 h-5" />
                <span>Contact Support</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}