"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import {
  setRoutingNumber,
  setAccountNumber,
  setAccountHolderName,
  setAmount,
  closeWithdrawModal,
} from "@/redux/features/paymentModalSlice/paymentModalSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export function WithdrawModal() {
  const [localRoutingNumber, setLocalRoutingNumber] = useState<string>("");
  const [localAccountNumber, setLocalAccountNumber] = useState<string>("");
  const [localAccountHolderName, setLocalAccountHolderName] = useState<string>("");
  const [localAmount, setLocalAmount] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isWithdrawModalOpen } = useSelector((state: RootState) => state.paymentModal);
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

  // Fetch wallet balance when modal opens
  useEffect(() => {
    console.log("Fetching wallet balance in WithdrawModal. userId:", userId, "token:", !!token);
    if (isWithdrawModalOpen && userId && token) {
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
            console.error("API error in WithdrawModal:", response.status, errorData);
            throw new Error(errorData.message || `Failed to fetch wallet balance (Status: ${response.status})`);
          }

          const data = await response.json();
          console.log("API response in WithdrawModal:", data);
          setWalletBalance(data.wallet?.balance || 0);
        } catch (err: any) {
          console.error("Error fetching wallet balance in WithdrawModal:", err.message);
          setError(err.message || "Failed to load wallet balance.");
          toast.error(err.message || "Failed to load wallet balance.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchWalletBalance();
    } else if (isWithdrawModalOpen) {
      setError("User ID or authentication token is missing.");
      toast.error("User ID or authentication token is missing.");
      setIsLoading(false);
    }
  }, [isWithdrawModalOpen, userId, token]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeWithdrawModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  const handleRoutingNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalRoutingNumber(value);
    dispatch(setRoutingNumber(value));
  };

  const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAccountNumber(value);
    dispatch(setAccountNumber(value));
  };

  const handleAccountHolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAccountHolderName(value);
    dispatch(setAccountHolderName(value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAmount(value);
    dispatch(setAmount(parseFloat(value) || 0));
  };

  const handleProceed = async () => {
    if (!userId || !token || !localRoutingNumber || !localAccountNumber || !localAccountHolderName || !localAmount) {
      setError("Missing required fields or authentication token.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const numericAmount = parseFloat(localAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      toast.error("Please enter a valid amount.");
      return;
    }

    if (numericAmount > walletBalance) {
      setError("Withdrawal amount exceeds available balance.");
      toast.error("Withdrawal amount exceeds available balance.");
      return;
    }

    if (!localRoutingNumber.trim() || localRoutingNumber.length !== 9) {
      setError("Please enter a valid 9-digit routing number.");
      toast.error("Please enter a valid 9-digit routing number.");
      return;
    }

    if (!localAccountNumber.trim() || localAccountNumber.length < 8 || localAccountNumber.length > 17) {
      setError("Please enter a valid account number (8-17 digits).");
      toast.error("Please enter a valid account number (8-17 digits).");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      userId,
      routingNumber: localRoutingNumber.trim(),
      accountNumber: localAccountNumber.trim(),
      accountHolderName: localAccountHolderName.trim(),
      amount: Math.round(numericAmount),
    };

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/payments/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if onboarding is required
        if (data.message === "Complete onboarding to receive payouts." && data.onboardingLink) {
          setError("You need to complete onboarding to enable withdrawals.");
          toast.error("Onboarding required. Redirecting to onboarding page...");
          setTimeout(() => {
            window.location.href = data.onboardingLink;
          }, 2000);
          return;
        }
        throw new Error(data.message || "Failed to process withdrawal");
      }

      // Show success toast and delay modal closure and page refresh
      toast.success(`Withdrawal of $${numericAmount.toFixed(2)} requested successfully!`, {
        duration: 3000,
      });

      // Delay modal closure and page refresh to allow toast visibility
      setTimeout(() => {
        dispatch(closeWithdrawModal());
        window.location.reload(); // Refresh the page
      }, 3000);
    } catch (err: any) {
      console.error("Error processing withdrawal:", err.message);
      setError(err.message || "Failed to process withdrawal. Please try again.");
      toast.error(err.message || "Failed to process withdrawal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWithdrawModalOpen) return null;

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
      <Dialog open={isWithdrawModalOpen} onOpenChange={() => dispatch(closeWithdrawModal())}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="sr-only">Withdraw Modal</DialogTitle>
          </DialogHeader>
          <button
            onClick={() => dispatch(closeWithdrawModal())}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="grid gap-4 py-4">
            <div className="relative bottom-5 flex justify-center align-middle space-y-2 border-b-2">
              <h2 className="relative bottom-3 text-lg font-semibold">Withdraw Funds</h2>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="110000000"
                type="text"
                value={localRoutingNumber}
                onChange={handleRoutingNumber}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="000123456789"
                type="text"
                value={localAccountNumber}
                onChange={handleAccountNumber}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                placeholder="John Doe"
                type="text"
                value={localAccountHolderName}
                onChange={handleAccountHolderName}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="50"
                type="text"
                value={localAmount}
                onChange={handleAmountChange}
                disabled={isLoading}
              />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Available Balance</span>
                <span className="text-sm text-gray-500">
                  {isLoading ? "Loading..." : `$${walletBalance.toFixed(2)}`}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-blue-600"
              onClick={handleProceed}
              disabled={isLoading || !localRoutingNumber || !localAccountNumber || !localAccountHolderName || !localAmount}
            >
              {isLoading ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}