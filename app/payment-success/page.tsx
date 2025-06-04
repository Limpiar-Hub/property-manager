"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import type { RootState } from "@/redux/store";

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Verifying your payment...");
  const [isSuccess, setIsSuccess] = useState(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId || !token) {
        setMessage("Missing payment session ID or authentication token.");
        setIsSuccess(false);
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
          setMessage("Payment successful! Your wallet has been updated.");
          setIsSuccess(true);
        } else {
          throw new Error("Payment verification failed.");
        }
      } catch (err) {
        setMessage(err.message || "Failed to verify payment. Please contact support.");
        setIsSuccess(false);
      }
    };

    verifyPayment();
  }, [token, router]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-2xl text-center max-w-md mx-4 border border-gray-700">
        {isSuccess === null ? (
          <motion.div
            className="mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="w-12 h-12 mx-auto text-blue-400" />
            <p className="mt-4 text-lg font-medium text-gray-200">{message}</p>
          </motion.div>
        ) : isSuccess ? (
          <>
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 blur-xl"></div>
              <FaCheckCircle className="w-16 h-16 mx-auto text-green-400 relative z-10" />
            </motion.div>
            <motion.p
              className="text-2xl font-semibold text-white mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {message}
            </motion.p>
            <motion.button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center mx-auto shadow-lg"
              onClick={() => router.push("/partner/payment")}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              View Payment Details
              <FaArrowRight className="ml-2" />
            </motion.button>
          </>
        ) : (
          <>
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 blur-xl"></div>
              <FaTimesCircle className="w-16 h-16 mx-auto text-red-400 relative z-10" />
            </motion.div>
            <motion.p
              className="text-2xl font-semibold text-white mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {message}
            </motion.p>
            <motion.button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center mx-auto shadow-lg"
              onClick={() => router.push("/support")}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
              <FaArrowRight className="ml-2" />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}