"use client";

import { useEffect, useState } from "react";
import { X, User, Check } from "lucide-react";
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
import { isAfter, parse } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Cleaner {
  _id: string;
  fullName: string;
}

export function MakePaymentModal() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [filteredCleaners, setFilteredCleaners] = useState<Cleaner[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localRecipientUserId, setLocalRecipientUserId] = useState<string>("");
  const [selectedCleanerName, setSelectedCleanerName] = useState<string>("");
  const [localAmount, setLocalAmount] = useState<string>("");
  const [localNote, setLocalNote] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<"weekly" | "bi-weekly" | "monthly">("weekly");
  const [startDate, setStartDate] = useState<string>("");

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

  // Fetch wallet balance and cleaners
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

          if (!response.ok) {
            throw new Error("Failed to fetch wallet balance.");
          }

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

          if (!response.ok) {
            throw new Error("Failed to load cleaners.");
          }

          const data = await response.json();
          setCleaners(data.cleaners || []);
          setFilteredCleaners(data.cleaners || []);
        } catch (err: any) {
          setError("Failed to load cleaners.");
        }
      };

      fetchWalletBalance();
      fetchCleaners();
    }
  }, [isMakePaymentModalOpen, userId, token]);

  // Filter cleaners based on search query
  useEffect(() => {
    const filtered = cleaners.filter((cleaner) =>
      cleaner.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCleaners(filtered);
  }, [searchQuery, cleaners]);

  // Sync local state with Redux
  useEffect(() => {
    setLocalRecipientUserId(recipientUserId || "");
    setLocalAmount(amount ? String(amount) : "");
    setLocalNote(note || "");
  }, [recipientUserId, amount, note]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeMakePaymentModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  const handleSelectCleaner = (cleaner: Cleaner) => {
    setLocalRecipientUserId(cleaner._id);
    setSelectedCleanerName(cleaner.fullName);
    dispatch(setRecipientUserId(cleaner._id));
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

    if (numericAmount > walletBalance) {
      setError("Insufficient balance.");
      return;
    }

    if (isRecurring) {
      if (!startDate) {
        setError("Please enter a start date.");
        return;
      }

      try {
        const parsedDate = parse(startDate, "yyyy-MM-dd", new Date());
        if (isNaN(parsedDate.getTime())) {
          setError("Invalid date format. Use YYYY-MM-DD (e.g., 2025-06-20).");
          return;
        }
        if (!isAfter(parsedDate, new Date())) {
          setError("Start date must be in the future.");
          return;
        }
      } catch (err) {
        setError("Invalid date format. Use YYYY-MM-DD (e.g., 2025-06-20).");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    const payload = isRecurring
      ? {
          recipientUserId: localRecipientUserId,
          amount: numericAmount,
          note: localNote,
          isRecurring: true,
          frequency,
          startDate: parse(startDate, "yyyy-MM-dd", new Date()).toISOString(),
        }
      : {
          recipientUserId: localRecipientUserId,
          amount: numericAmount,
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

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Complete onboarding to receive payouts." && data.onboardingLink) {
          setError("Onboarding required. Redirecting...");
          window.location.href = data.onboardingLink;
          return;
        }
        throw new Error(data.message || "Payment failed");
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
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">Make Payment Modal</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
          <div className="text-center border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800">Pay Your Staff</h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="searchCleaner" className="text-sm font-medium text-gray-700">
              Search Staff
            </Label>
            <Input
              id="searchCleaner"
              type="text"
              placeholder="Enter staff name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-gray-700">Select Staff</Label>
            <div className="h-48 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <AnimatePresence>
                {filteredCleaners.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-gray-500 text-center py-4"
                  >
                    No staff found.
                  </motion.p>
                ) : (
                  filteredCleaners.map((cleaner) => (
                    <motion.div
                      key={cleaner._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition-all duration-300
                        ${localRecipientUserId === cleaner._id ? "bg-indigo-50 border-2 border-indigo-500 shadow-md" : "hover:bg-gray-100"}
                        bg-white shadow-sm hover:shadow-lg`}
                      onClick={() => handleSelectCleaner(cleaner)}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 flex-1">{cleaner.fullName}</span>
                      {localRecipientUserId === cleaner._id && (
                        <Check className="h-5 w-5 text-indigo-500" />
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {selectedCleanerName && (
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium text-indigo-600">{selectedCleanerName}</span>
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Salary Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={localAmount}
              onChange={handleAmountChange}
              disabled={isLoading}
              placeholder="Enter amount"
              className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Available Balance</span>
              <span>${walletBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="note" className="text-sm font-medium text-gray-700">
              Payment Note
            </Label>
            <Input
              id="note"
              type="text"
              value={localNote}
              onChange={handleNoteChange}
              disabled={isLoading}
              placeholder="e.g., Monthly salary"
              className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <Label className="text-sm font-semibold text-gray-800">Payment Options</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!isRecurring}
                  onChange={() => {
                    setIsRecurring(false);
                    setStartDate("");
                    setFrequency("weekly");
                  }}
                  disabled={isLoading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Send Now</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(true)}
                  disabled={isLoading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Set Up Recurring Salary</span>
              </label>
            </div>

            <AnimatePresence>
              {isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-3"
                >
                  <div>
                    <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
                      Payment Frequency
                    </Label>
                    <select
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as "weekly" | "bi-weekly" | "monthly")}
                      className="w-full p-2 mt-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      disabled={isLoading}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="text"
                      placeholder="YYYY-MM-DD (e.g., 2025-06-20)"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={isLoading}
                      className="mt-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleProceed}
            disabled={
              isLoading ||
              !localRecipientUserId ||
              !localAmount ||
              !localNote ||
              (isRecurring && (!startDate || !frequency))
            }
          >
            {isLoading ? "Processing..." : isRecurring ? "Set Up Recurring Payment" : "Send Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}