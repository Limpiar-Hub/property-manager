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
import { setRecipientUserId, setAmount, setNote, closeMakePaymentModal } from "@/redux/features/paymentModalSlice/paymentModalSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Cleaner {
  _id: string;
  fullName: string;
}

export function MakePaymentModal() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [localRecipientUserId, setLocalRecipientUserId] = useState<string>("");
  const [localAmount, setLocalAmount] = useState<string>("");
  const [localNote, setLocalNote] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isMakePaymentModalOpen, recipientUserId, amount, note } = useSelector(
    (state: RootState) => state.paymentModal || {}
  );
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

  // Fetch wallet balance and cleaners when modal opens
  useEffect(() => {
    console.log("Fetching wallet balance in MakePaymentModal. userId:", userId, "token:", !!token);
    if (isMakePaymentModalOpen && userId && token) {
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
            console.error("API error in MakePaymentModal:", response.status, errorData);
            throw new Error(errorData.message || `Failed to fetch wallet balance (Status: ${response.status})`);
          }

          const data = await response.json();
          console.log("API response in MakePaymentModal:", data);
          setWalletBalance(data.wallet?.balance || 0);
        } catch (err: any) {
          console.error("Error fetching wallet balance in MakePaymentModal:", err.message);
          setError(err.message || "Failed to load wallet balance.");
        } finally {
          setIsLoading(false);
        }
      };

      const fetchCleaners = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://limpiar-backend.onrender.com/api/users/cleaning-business/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch cleaners");
          }

          const data = await response.json();
          console.log("Cleaners API response:", data);
          setCleaners(data.cleaners || []);
        } catch (err: any) {
          console.error("Error fetching cleaners:", err.message);
          setError(err.message || "Failed to load cleaners. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchWalletBalance();
      fetchCleaners();
    } else if (isMakePaymentModalOpen) {
      setError("User ID or authentication token is missing.");
      setIsLoading(false);
    }
  }, [isMakePaymentModalOpen, userId, token]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeMakePaymentModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  // Sync local state with Redux state
  useEffect(() => {
    setLocalRecipientUserId(recipientUserId || "");
    setLocalAmount(amount ? String(amount) : "");
    setLocalNote(note || "");
  }, [recipientUserId, amount, note]);

  const handleRecipientUserId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalRecipientUserId(value);
    dispatch(setRecipientUserId(value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAmount(value);
    dispatch(setAmount(parseFloat(value) || 0));
  };

  const handleNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalNote(value);
    dispatch(setNote(value));
  };

  const handleProceed = async () => {
    if (!userId || !token || !localRecipientUserId || !localAmount || !localNote) {
      setError("Missing required fields or authentication token.");
      return;
    }

    const numericAmount = parseFloat(localAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount * 100 > walletBalance) {
      setError("Payment amount exceeds available balance.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      senderUserId: userId,
      recipientUserId: localRecipientUserId,
      amount: Math.round(numericAmount * 100), // Convert to cents
      note: localNote,
    };

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/wallets/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process payment");
      }

      console.log("Payment request successful");
      dispatch(closeMakePaymentModal());
    } catch (err: any) {
      console.error("Error processing payment:", err.message);
      setError(err.message || "Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMakePaymentModalOpen) return null;

  return (
    <Dialog open={isMakePaymentModalOpen} onOpenChange={() => dispatch(closeMakePaymentModal())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Make Payment Modal</DialogTitle>
        </DialogHeader>
        <button
          onClick={() => dispatch(closeMakePaymentModal())}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid gap-4 py-4">
          <div className="relative bottom-5 flex justify-center align-middle space-y-2 border-b-2">
            <h2 className="relative bottom-3 text-lg font-semibold">Make Payment</h2>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="grid gap-2">
            <Label htmlFor="recipientUserId">Select Cleaner</Label>
            <select
              id="recipientUserId"
              value={localRecipientUserId}
              onChange={handleRecipientUserId}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoading || cleaners.length === 0}
            >
              <option value="">Select a cleaner</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner._id} value={cleaner._id}>
                  {cleaner.fullName}
                </option>
              ))}
            </select>
            {isLoading && <div className="text-sm text-gray-600">Loading cleaners...</div>}
            {!isLoading && cleaners.length === 0 && !error && (
              <div className="text-sm text-gray-500">No cleaners available</div>
            )}
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
                {isLoading ? "Loading..." : `$${((walletBalance || 0) / 100).toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              placeholder="Payment note"
              type="text"
              value={localNote}
              onChange={handleNote}
              disabled={isLoading}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleProceed}
            disabled={isLoading || !localRecipientUserId || !localAmount || !localNote}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}