"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import AHCTransferModal from "./ahc-transfer-modal"; // Adjust path as needed

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (paymentMethod: "debit" | "ahc") => void;
  amount: string;
  setAmount: (amount: string) => void;
}

export default function TopUpModal({ isOpen, onClose, onProceed, amount, setAmount }: TopUpModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "ahc">("debit");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isAHCModalOpen, setIsAHCModalOpen] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

  // Retrieve user details from localStorage
  const userWallet = (() => {
    const getUserFromLocalStorage = localStorage.getItem("userWallet");
    if (getUserFromLocalStorage) {
      try {
        const user = JSON.parse(getUserFromLocalStorage);
        return user.data;
      } catch (e) {
        console.error("Error parsing userWallet from localStorage:", e);
        return null;
      }
    }
    return null;
  })();

  const userId = userWallet?.user?.userId;
  const email = userWallet?.user?.email;

  // Fetch wallet balance when modal opens
  useEffect(() => {
    console.log("Fetching wallet balance in TopUpModal. userId:", userId, "token:", !!token);
    if (isOpen && userId && token) {
      const fetchWalletBalance = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://limpiar-backend.onrender.com/api/users/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("API error in TopUpModal:", response.status, errorData);
            throw new Error(errorData.message || `Failed to fetch wallet balance (Status: ${response.status})`);
          }

          const data = await response.json();
          console.log("API response in TopUpModal:", data);
          setWalletBalance(data.wallet?.balance || 0);
        } catch (err: any) {
          console.error("Error fetching wallet balance in TopUpModal:", err.message);
          setError(err.message || "Failed to load wallet balance.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchWalletBalance();
    } else if (isOpen) {
      setError("User ID or authentication token is missing.");
      setIsLoading(false);
    }
  }, [isOpen, userId, token]);

  // Handle Stripe payment initiation for debit/credit
  const handleProceed = async () => {
    if (paymentMethod === "ahc") {
      setIsAHCModalOpen(true);
      return;
    }

    if (!userId || !email || !amount || !token) {
      setError("Missing required fields or authentication token.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      userId,
      bookingId: "679bb35b7902d90855a9e5fc", // Placeholder; replace with dynamic bookingId if available
      amount: Math.round(numericAmount * 100), // Convert to cents for Stripe
      currency: "usd",
      email,
    };

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/payments/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Invalid response from payment initiation");
      }
    } catch (err: any) {
      console.error("Error initiating payment:", err.message);
      setError(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment verification after Stripe redirect
  useEffect(() => {
    const verifyPayment = async (reference: string) => {
      if (!token) {
        setError("Authentication token missing.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://limpiar-backend.onrender.com/api/payments/success/${reference}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to verify payment");
        }

        const data = await response.json();
        if (data.success) {
          console.log("Payment verified:", data);
          setWalletBalance(data.paymentResult?.walletBalance ?? walletBalance);
          alert(`Payment successful! Your wallet balance is now $${(data.paymentResult?.walletBalance)?.toFixed(2) ?? (walletBalance ).toFixed(2)}.`);
          onClose();
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (err: any) {
        console.error("Error verifying payment:", err.message);
        setError(err.message || "Failed to verify payment. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && !isAHCModalOpen) {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");
      if (reference) {
        verifyPayment(reference);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isOpen, isAHCModalOpen, token, onClose, walletBalance]);

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isAHCModalOpen ? "hidden" : ""}`}>
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Top Up Wallet</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">
                Enter Amount
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter amount"
                disabled={isLoading}
              />
            </div>

            <div className="text-sm text-gray-600">
              Available Balance: <span className="font-medium">${(walletBalance ).toFixed(2)}</span>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-600 mb-3">Choose your payment option:</p>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "debit"}
                    onChange={() => setPaymentMethod("debit")}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    disabled={isLoading}
                  />
                  <span>Debit / Credit Card</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "ahc"}
                    onChange={() => setPaymentMethod("ahc")}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    disabled={isLoading}
                  />
                  <span>ACH Transfer</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={handleProceed}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      </div>

      <AHCTransferModal
        isOpen={isAHCModalOpen}
        onClose={() => {
          setIsAHCModalOpen(false);
          onClose();
        }}
        amount={amount}
        onBack={() => setIsAHCModalOpen(false)}
      />
    </>
  );
}