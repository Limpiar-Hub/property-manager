
"use client";

import { useEffect, useState } from "react";
import { Search, CreditCard, RefreshCw, Send, DollarSign, FileText, Mail } from "lucide-react";
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
import { openInvoiceModal, closeInvoiceModal } from "@/redux/invoiceModalSlice/invoiceModalSlice";
import type { RootState } from "@/redux/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

interface UserWallet {
  data: {
    user: {
      userId: string;
    };
  } | null;
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);
  const [isDebitCardModalOpen, setIsDebitCardModalOpen] = useState<boolean>(false);
  const [isAHCTransferModalOpen, setIsAHCTransferModalOpen] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("1000.00");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [showInvoiceSuccessModal, setShowInvoiceSuccessModal] = useState<boolean>(false);
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const isInvoiceModalOpen = useSelector((state: RootState) => state.invoiceModal.isInvoiceModalOpen);

  const userWallet: UserWallet["data"] = (() => {
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
  const cleaningBusinessId = userId;

  useEffect(() => {
    console.log("Fetching wallet balance. userId:", userId, "token:", !!token);
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
          console.log("Wallet balance response:", data);
          setWalletBalance(data.wallet?.balance || 0);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load wallet balance.";
          console.error("Error fetching wallet balance:", errorMessage);
          setError(errorMessage);
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

  const handleTopUpWallet = () => {
    setIsTopUpModalOpen(true);
  };

  const handleRequestRefund = () => {
    dispatch(openRefundModal());
  };

  const handleWithdraw = () => {
    dispatch(openWithdrawModal());
  };

  const handleMakePayment = () => {
    dispatch(openMakePaymentModal());
  };

  const handleGenerateInvoice = () => {
    dispatch(openInvoiceModal());
  };

  const handleProceedToPayment = (paymentMethod: "debit" | "ahc") => {
    setIsTopUpModalOpen(false);
    if (paymentMethod === "debit") {
      setIsDebitCardModalOpen(true);
    } else {
      setIsAHCTransferModalOpen(true);
    }
  };

  const handleForwardToAdmin = async () => {
    if (!invoiceId || !cleaningBusinessId || !token) {
      toast.error("Invoice ID, cleaning business ID, or authentication token is missing.", {
        id: "forward-invoice-missing",
      });
      return;
    }

    try {
      setIsForwarding(true);
      const response = await fetch(`https://limpiar-backend.onrender.com/api/bookings/send-invoice-to-admin/${cleaningBusinessId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invoiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to forward invoice (Status: ${response.status})`);
      }

      toast.success("Invoice successfully forwarded to admin!", { id: "forward-invoice-success" });
      setShowInvoiceSuccessModal(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to forward invoice.";
      console.error("Error forwarding invoice:", errorMessage);
      toast.error(errorMessage, { id: "forward-invoice-error" });
    } finally {
      setIsForwarding(false);
    }
  };

  const handleGenerateInvoiceSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please provide both start and end dates.", { id: "invoice-date-missing" });
      return;
    }

    if (!cleaningBusinessId || !token) {
      toast.error("Cleaning business ID or authentication token is missing.", {
        id: "invoice-missing-credentials",
      });
      return;
    }

    let formattedStartDate: string, formattedEndDate: string;
    try {
      formattedStartDate = new Date(startDate).toISOString();
      formattedEndDate = new Date(endDate + "T23:59:59.999Z").toISOString();
    } catch (err: unknown) {
      toast.error("Invalid date format. Please select valid dates.", { id: "invoice-invalid-date" });
      return;
    }

    const requestBody = { startDate: formattedStartDate, endDate: formattedEndDate };
    const requestUrl = `https://limpiar-backend.onrender.com/api/bookings/generate-invoice/${cleaningBusinessId}`;
    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Request Details:", {
      url: requestUrl,
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
      token: token ? token.slice(0, 10) + "..." : "undefined",
    });

    setIsGeneratingInvoice(true);
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      const rawResponse = await response.text();
      console.log("Raw Response:", rawResponse);

      let data: { message?: string; pdfUrl?: string; invoiceId?: string };
      try {
        data = JSON.parse(rawResponse);
      } catch (err: unknown) {
        throw new Error(`Invalid JSON response from server: ${rawResponse}`);
      }

      console.log("Parsed Response:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `Failed to generate invoice (${response.status})`);
      }

      setInvoiceId(data.invoiceId || null);
      setShowInvoiceSuccessModal(true);
      dispatch(closeInvoiceModal());
      setStartDate("");
      setEndDate("");
      toast.success("Invoice generated successfully!", { id: "invoice-generate-success" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate invoice.";
      console.error("Error generating invoice:", errorMessage, err);
      toast.error(`You may not have task for this duration kindly contact support: ${errorMessage}`, { id: "invoice-generate-error" });
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <div>
      {/* Single Toaster for all toasts. TopUpModal, WithdrawModal, and MakePaymentModal should NOT render their own Toaster and must use unique toast IDs. */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      <div className="mb-6">
        <WalletCard balance={walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-[15rem]">
        <button
          onClick={handleTopUpWallet}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Top Up Wallet"
        >
          <CreditCard className="h-5 w-5" />
          Top Up Wallet
        </button>
        <button
          onClick={handleRequestRefund}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Request Refund"
        >
          <RefreshCw className="h-5 w-5" />
          Request Refund
        </button>
        <button
          onClick={handleWithdraw}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Withdraw"
        >
          <DollarSign className="h-5 w-5" />
          Withdraw
        </button>
        <button
          onClick={handleMakePayment}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Make Payment"
        >
          <Send className="h-5 w-5" />
          Make Payment
        </button>
        <button
          onClick={handleGenerateInvoice}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Generate Invoice"
        >
          <FileText className="h-5 w-5" />
          Generate Invoice
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

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

      <TransactionTable searchQuery={searchQuery} statusFilter={statusFilter} />

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

      {isInvoiceModalOpen && (
        <Dialog open={isInvoiceModalOpen} onOpenChange={() => dispatch(closeInvoiceModal())}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="startDate" className="text-right">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="endDate" className="text-right">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => dispatch(closeInvoiceModal())}>
                Cancel
              </Button>
              <Button onClick={handleGenerateInvoiceSubmit} disabled={isGeneratingInvoice}>
                {isGeneratingInvoice ? "Generating..." : "Generate Invoice"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showInvoiceSuccessModal && (
        <Dialog open={showInvoiceSuccessModal} onOpenChange={() => setShowInvoiceSuccessModal(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">Invoice Sent</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Mail className="text-green-600" size={48} />
              <p className="text-gray-700 text-center">
                Your invoice has been sent to your email.
              </p>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={handleForwardToAdmin}
                disabled={isForwarding}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isForwarding ? "Sending..." : "Send to Admin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <RequestRefundModal />
      <WithdrawModal />
      <MakePaymentModal />
    </div>
  );
}
