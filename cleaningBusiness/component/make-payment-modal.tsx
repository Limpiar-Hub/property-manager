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
  setRecipientUserId,
  setAmount,
  setNote,
  closeMakePaymentModal,
} from "@/redux/features/paymentModalSlice/paymentModalSlice";
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
  const [localAmount, setLocalAmount] = useState<string>(""); // Dollars
  const [localNote, setLocalNote] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0); // In dollars
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { isMakePaymentModalOpen, recipientUserId, amount, note } = useSelector(
    (state: RootState) => state.paymentModal || {}
  );
  const token = useSelector((state: RootState) => state.auth.token);

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

  useEffect(() => {
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

          const data = await response.json();
          setWalletBalance(data.wallet?.balance || 0);
        } catch (err: any) {
          setError("Failed to fetch wallet balance.");
        } finally {
          setIsLoading(false);
        }
      };

      const fetchCleaners = async () => {
        try {
          const response = await fetch(`https://limpiar-backend.onrender.com/api/users/cleaning-business/${userId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          setCleaners(data.cleaners || []);
        } catch (err: any) {
          setError("Failed to load cleaners.");
        }
      };

      fetchWalletBalance();
      fetchCleaners();
    }
  }, [isMakePaymentModalOpen, userId, token]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeMakePaymentModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalNote(value);
    dispatch(setNote(value));
  };

  const handleProceed = async () => {
    if (!userId || !token || !localRecipientUserId || !localAmount || !localNote) {
      setError("All fields are required.");
      return;
    }

    const numericAmount = parseFloat(localAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }


    setIsLoading(true);
    setError(null);

    const payload = {
      senderUserId: userId,
      recipientUserId: localRecipientUserId,
      amount: numericAmount, // in dollars
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
        throw new Error(errorData.message || "Payment failed");
      }

      dispatch(closeMakePaymentModal());
    } catch (err: any) {
      setError(err.message || "Payment failed.");
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
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center border-b-2 pb-2">
            <h2 className="text-lg font-semibold">Make Payment</h2>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="grid gap-2">
            <Label htmlFor="recipientUserId">Select Cleaner</Label>
            <select
              id="recipientUserId"
              value={localRecipientUserId}
              onChange={handleRecipientUserId}
              className="w-full p-2 border rounded-md"
              disabled={isLoading || cleaners.length === 0}
            >
              <option value="">Select a cleaner</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner._id} value={cleaner._id}>
                  {cleaner.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={localAmount}
              onChange={handleAmountChange}
              disabled={isLoading}
              placeholder="Enter exact balance"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Available Balance</span>
              <span>${walletBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              type="text"
              value={localNote}
              onChange={handleNoteChange}
              disabled={isLoading}
              placeholder="Payment note"
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleProceed}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
