"use client";

import { Plus, RefreshCcw, DollarSign, X } from "lucide-react";
import { TransactionTable } from "@/components/payment/transaction-table";
import { fetchTransactionData, fetchUserBalanceData } from "@/components/handlers";
import { useDispatch, useSelector } from "react-redux";
import { openRefundModal, openModal, setUserBalance } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { RootState } from "@/redux/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  status: "pending" | "succeeded" | "Rejected" | "completed";
};

type TransactionApiResponse = {
  id: string;
  amount: number;
  date?: string;
  description?: string;
  paymentMethod?: string;
  status: string;
};

const TopUpModal = dynamic(
  () =>
    import("@/components/payment/top-up-modal/top-up-modal").then(
      (mod) => mod.TopUpModal
    ),
  { ssr: false }
);

const RefundModal = dynamic(
  () =>
    import("@/components/payment/refund-modal/refund-modal").then(
      (mod) => mod.RefundModal
    ),
  { ssr: false }
);

export default function PaymentsPage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [localRoutingNumber, setLocalRoutingNumber] = useState<string>("");
  const [localAccountNumber, setLocalAccountNumber] = useState<string>("");
  const [localAccountHolderName, setLocalAccountHolderName] = useState<string>("");
  const [localAmount, setLocalAmount] = useState<string>("");
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const dispatch = useDispatch();
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

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const [transactionsRes, balanceRes] = await Promise.all([
        fetchTransactionData(),
        fetchUserBalanceData(),
      ]);

      if (transactionsRes.data) {
        setTransactions(
          transactionsRes.data.map((transaction: any) => ({
            id: transaction.id,
            amount: transaction.amount,
            date: transaction.createdAt || "",
            description: transaction.description || "",
            paymentMethod: transaction.method || "",
            status: transaction.status as "pending" | "succeeded" | "Rejected" | "completed",
          }))
        );
      }
      if (balanceRes.data) {
        setWalletBalance(balanceRes.data);
        dispatch(setUserBalance(balanceRes.data));
      }
    };

    getData().finally(() => setIsLoading(false));
  }, [dispatch]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsWithdrawModalOpen(false);
        setLocalRoutingNumber("");
        setLocalAccountNumber("");
        setLocalAccountHolderName("");
        setLocalAmount("");
        setWithdrawError(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleRoutingNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRoutingNumber(e.target.value);
  };

  const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAccountNumber(e.target.value);
  };

  const handleAccountHolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAccountHolderName(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAmount(e.target.value);
  };

  const handleProceed = async () => {
    if (!userId || !token || !localRoutingNumber || !localAccountNumber || !localAccountHolderName || !localAmount) {
      setWithdrawError("Missing required fields or authentication token.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const numericAmount = parseFloat(localAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      toast.error("Please enter a valid amount.");
      return;
    }

    if (numericAmount > walletBalance) {
      setWithdrawError("Withdrawal amount exceeds available balance.");
      toast.error("Withdrawal amount exceeds available balance.");
      return;
    }

    if (!localRoutingNumber.trim() || localRoutingNumber.length !== 9) {
      setWithdrawError("Please enter a valid 9-digit routing number.");
      toast.error("Please enter a valid 9-digit routing number.");
      return;
    }

    if (!localAccountNumber.trim() || localAccountNumber.length < 8 || localAccountNumber.length > 17) {
      setWithdrawError("Please enter a valid account number (8-17 digits).");
      toast.error("Please enter a valid account number (8-17 digits).");
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError(null);

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
        if (data.message === "Complete onboarding to receive payouts." && data.onboardingLink) {
          setWithdrawError("You need to complete onboarding to enable withdrawals.");
          toast.error("Onboarding required. Redirecting to onboarding page...");
          setTimeout(() => {
            window.location.href = data.onboardingLink;
          }, 2000);
          return;
        }
        throw new Error(data.message || "Failed to process withdrawal");
      }

      // Update local and Redux state with new balance
      const newBalance = walletBalance - numericAmount;
      setWalletBalance(newBalance);
      dispatch(setUserBalance(newBalance));

      // Update transactions
      const newTransaction: Transaction = {
        id: data.id || `withdraw-${Date.now()}`,
        amount: numericAmount,
        date: new Date().toISOString(),
        description: "Withdrawal to bank account",
        paymentMethod: "Bank Transfer",
        status: "pending",
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      // Show success toast and close modal
      toast.success(`Withdrawal of $${numericAmount.toFixed(2)} requested successfully!`, {
        duration: 3000,
      });

      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setLocalRoutingNumber("");
        setLocalAccountNumber("");
        setLocalAccountHolderName("");
        setLocalAmount("");
        setWithdrawError(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error processing withdrawal:", err.message);
      setWithdrawError(err.message || "Failed to process withdrawal. Please try again.");
      toast.error(err.message || "Failed to process withdrawal. Please try again.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50">
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
            style: { borderColor: "#22c55e", color: "#166534" },
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            style: { borderColor: "#ef4444", color: "#991b1b" },
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Payments</h1>
          <div className="flex flex-col items-center justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="bg-[#2D82FF] rounded-lg p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-20">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,100 C20,120 40,140 60,120 C80,100 100,80 120,100 C140,120 160,140 180,120 C200,100 220,80 240,100 C260,120 280,140 300,120 C320,100 340,80 360,100 C380,120 400,140 420,120"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,80 C20,100 40,120 60,100 C80,80 100,60 120,80 C140,100 160,120 180,100 C200,80 220,60 240,80 C260,100 280,120 300,100 C320,80 340,60 360,80 C380,100 400,120 420,100"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,60 C20,80 40,100 60,80 C80,60 100,40 120,60 C140,80 160,100 180,80 C200,60 220,40 240,60 C260,80 280,100 300,80 C320,60 340,40 360,60 C380,80 400,100 420,80"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,40 C20,60 40,80 60,60 C80,40 100,20 120,40 C140,60 160,80 180,60 C200,40 220,20 240,40 C260,60 280,80 300,60 C320,40 340,20 360,40 C380,60 400,80 420,60"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,20 C20,40 40,60 60,40 C80,20 100,0 120,20 C140,40 160,60 180,40 C200,20 220,0 240,20 C260,40 280,60 300,40 C320,20 340,0 360,20 C380,40 400,60 420,40"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="relative z-10 text-center">
                  <p className="text-lg mb-2">Wallet Balance</p>
                  <p className="text-4xl font-bold">
                    {isLoading ? (
                      <span className="text-xl">Loading...</span>
                    ) : (
                      `$${walletBalance.toLocaleString()}`
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => dispatch(openModal())}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Top Up Wallet
                </button>
                <button
                  onClick={() => dispatch(openRefundModal())}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Request Refund
                </button>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium"
                >
                  <DollarSign className="w-4 h-4" />
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <TransactionTable transactions={transactions} />
          </div>
        </div>

        <TopUpModal fetchTransactions={fetchTransactionData} />
        <RefundModal />

        <Dialog open={isWithdrawModalOpen} onOpenChange={() => {
          setIsWithdrawModalOpen(false);
          setLocalRoutingNumber("");
          setLocalAccountNumber("");
          setLocalAccountHolderName("");
          setLocalAmount("");
          setWithdrawError(null);
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="sr-only">Withdraw Modal</DialogTitle>
            </DialogHeader>
            <button
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setLocalRoutingNumber("");
                setLocalAccountNumber("");
                setLocalAccountHolderName("");
                setLocalAmount("");
                setWithdrawError(null);
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state

System: open]:text-muted-foreground"
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
                  disabled={withdrawLoading}
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
                  disabled={withdrawLoading}
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
                  disabled={withdrawLoading}
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
                  disabled={withdrawLoading}
                />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Available Balance</span>
                  <span className="text-sm text-gray-500">
                    {isLoading ? "Loading..." : `$${walletBalance.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-900 hover:bg-blue-600"
                onClick={handleProceed}
                disabled={withdrawLoading || !localRoutingNumber || !localAccountNumber || !localAccountHolderName || !localAmount}
              >
                {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}