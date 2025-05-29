"use client";

import { useEffect, useState } from "react";
import { Search, CreditCard, RefreshCw, Send, DollarSign } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import WalletCard from "@/cleaningBusiness/component/wallet-card";
import TransactionTable from "@/cleaningBusiness/component/transaction-table";
import TopUpModal from "@/cleaningBusiness/component/top-up-modal";
import DebitCardModal from "@/cleaningBusiness/component/debit-card-modal";
import AHCTransferModal from "@/cleaningBusiness/component/ahc-transfer-modal";
import RequestRefundModal from "@/cleaningBusiness/component/request-refund-modal";
import { WithdrawModal } from "@/cleaningBusiness/component/withdrawal-modal";
import { MakePaymentModal } from "@/cleaningBusiness/component/make-payment-modal";
import { openWithdrawModal, openMakePaymentModal } from "@/redux/features/paymentModalSlice/paymentModalSlice";
import { openRefundModal } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import type { RootState } from "@/redux/store";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isDebitCardModalOpen, setIsDebitCardModalOpen] = useState(false);
  const [isAHCTransferModalOpen, setIsAHCTransferModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("1000.00");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch wallet balance
  useEffect(() => {
    console.log("Fetching wallet balance. userId:", userId, "token:", !!token); // Debug log
    if (userId && token) {
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
            console.error("API error:", response.status, errorData);
            throw new Error(errorData.message || `Failed to fetch wallet balance (Status: ${response.status})`);
          }

          const data = await response.json();
          console.log("API response:", data); // Debug log
          setWalletBalance(data.wallet?.balance || 0); // Access wallet.balance
        } catch (err: any) {
          console.error("Error fetching wallet balance:", err.message);
          setError(err.message || "Failed to load wallet balance.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchWalletBalance();
    } else {
      setError("User ID or authentication token is missing.");
      setIsLoading(false);
    }
  }, [userId, token]);

  // Handle top up wallet button click
  const handleTopUpWallet = () => {
    setIsTopUpModalOpen(true);
  };

  // Handle request refund button click
  const handleRequestRefund = () => {
    dispatch(openRefundModal());
  };

  // Handle withdraw button click
  const handleWithdraw = () => {
    dispatch(openWithdrawModal());
  };

  // Handle make payment button click
  const handleMakePayment = () => {
    dispatch(openMakePaymentModal());
  };

  // Handle proceed to payment method
  const handleProceedToPayment = (paymentMethod: "debit" | "ahc") => {
    setIsTopUpModalOpen(false);
    if (paymentMethod === "debit") {
      setIsDebitCardModalOpen(true);
    } else {
      setIsAHCTransferModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      {/* Wallet Balance Card */}
      <div className="mb-6">
        {isLoading ? (
          <div className="text-gray-600">Loading balance...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <WalletCard balance={walletBalance.toFixed(2)} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-[15rem]">
        <button
          onClick={handleTopUpWallet}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="h-5 w-5" />
          Top Up Wallet
        </button>
        <button
          onClick={handleRequestRefund}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          Request Refund
        </button>
        <button
          onClick={handleWithdraw}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <DollarSign className="h-5 w-5" />
          Withdraw
        </button>
        <button
          onClick={handleMakePayment}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <Send className="h-5 w-5" />
          Make Payment
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Transaction Table */}
      <TransactionTable searchQuery={searchQuery} statusFilter={statusFilter} />

      {/* Modals */}
      {isTopUpModalOpen && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          onProceed={handleProceedToPayment}
          amount={topUpAmount}
          setAmount={setTopUpAmount}
        />
      )}

      {isDebitCardModalOpen && (
        <DebitCardModal
          isOpen={isDebitCardModalOpen}
          onClose={() => setIsDebitCardModalOpen(false)}
          amount={topUpAmount}
          onBack={() => {
            setIsDebitCardModalOpen(false);
            setIsTopUpModalOpen(true);
          }}
        />
      )}

      {isAHCTransferModalOpen && (
        <AHCTransferModal
          isOpen={isAHCTransferModalOpen}
          onClose={() => setIsAHCTransferModalOpen(false)}
          amount={topUpAmount}
          onBack={() => {
            setIsAHCTransferModalOpen(false);
            setIsTopUpModalOpen(true);
          }}
        />
      )}

      <RequestRefundModal />
      <WithdrawModal />
      <MakePaymentModal />
    </div>
  );
}