
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Transaction {
  key: string;
  id: string;
  date: string;
  formattedDate: string;
  description: string;
  amount: string;
  paymentMethod: string;
  status: string;
  source: "stripe" | "wallet";
}

interface RecurringPayment {
  _id: string;
  senderUserId: string;
  recipientUserId: string;
  senderFullName?: string;
  recipientFullName?: string | null;
  note: string;
  frequency: string;
  startDate: string;
  nextRun: string;
  status: string;
  createdAt: string;
  amount?: string;
}

interface TransactionDetails {
  transactionId: string;
  amount: number;
  from: string;
  to: string;
  status: string;
  type?: string;
  transactionCategory: string;
  description: string;
  timestamp: string;
  fromFullName: string;
  toFullName: string;
  pdf?: string;
  receiptUrl?: string;
 
}

interface TransactionTableProps {
  transactions: Transaction[];
  searchQuery: string;
  statusFilter: string;
}

interface RecurringPaymentTableProps {
  recurringPayments: RecurringPayment[];
  searchQuery: string;
  statusFilter: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function DetailRowPurple({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 items-baseline">
      <span className="col-span-1 text-purple-600 font-medium">{label}</span>
      <span className={`col-span-2 break-words ${className}`}>{value}</span>
    </div>
  );
}

function TransactionTable({
  transactions,
  searchQuery,
  statusFilter,
}: TransactionTableProps) {
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    let filtered = transactions;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(lowerQuery) ||
          transaction.paymentMethod.toLowerCase().includes(lowerQuery) ||
          transaction.id.toLowerCase().includes(lowerQuery)
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchQuery, statusFilter]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTransaction(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!selectedTransaction || !token) {
      setTransactionDetails(null);
      setErrorDetails(null);
      return;
    }

    const fetchTransactionDetails = async () => {
      setIsLoadingDetails(true);
      setErrorDetails(null);

      try {
        let response;
        let data;

        if (selectedTransaction.source === "stripe") {
          response = await fetch(
            `https://limpiar-backend.onrender.com/api/payments/${selectedTransaction.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch Stripe payment details (Status: ${response.status})`);
          }

          data = await response.json();
          if (data.success && data.data) {
            const payment = data.data;
            setTransactionDetails({
              transactionId: payment._id,
              amount: payment.amount,
              from: "Stripe",
              to: payment.userId._id,
              status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
              type: "credit",
              transactionCategory: "topup",
              description: payment.bookingId ? `Booking Payment` : "Wallet Top Up",
              timestamp: payment.createdAt,
              fromFullName: "Stripe",
              toFullName: payment.userId.fullName || payment.userId.email || payment.userId._id,
              receiptUrl: payment.receiptUrl,
            });
          } else {
            throw new Error("Invalid Stripe payment data received");
          }
        } else {
          response = await fetch(
            `https://limpiar-backend.onrender.com/api/wallets/transaction/${selectedTransaction.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch transaction details (Status: ${response.status})`);
          }

          data = await response.json();
          if (data.success) {
            let txn;
            let type;

            if (data.creditTransaction && data.debitTransaction) {
              // For wallet transfers, classify based on userId
              const userWallet = JSON.parse(localStorage.getItem("userWallet") || "{}")?.data;
              const userId = userWallet?.user?.userId;
              const isCredit = data.creditTransaction.to === userId || data.debitTransaction.to === userId;
              txn = isCredit ? data.creditTransaction : data.debitTransaction;
              type = isCredit ? "credit" : "debit";
            } else {
              // Default handling for other transactions
              txn = data.debitTransaction || data.creditTransaction;
              type = txn.type;
            }

            if (!txn) {
              throw new Error("No transaction data found in response");
            }
            setTransactionDetails({
              transactionId: txn.transactionId,
              amount: txn.amount,
              from: txn.from,
              to: txn.to,
              status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
              type: type,
              transactionCategory: txn.transactionCategory,
              description: txn.description,
              timestamp: txn.timestamp,
              fromFullName: txn.fromUser?.fullName || txn.from,
              toFullName: txn.toUser?.fullName || txn.to,
              pdf: data.pdf,
            });
          } else {
            throw new Error("Invalid transaction data received");
          }
        }
      } catch (error: any) {
        console.error("Error fetching transaction details:", error);
        setErrorDetails(error.message || "Failed to load transaction details.");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchTransactionDetails();
  }, [selectedTransaction, token]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredTransactions.length);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleSelectRow = (id: string) => {
    setSelectedRows(
      selectedRows.includes(id)
        ? selectedRows.filter((rowId) => rowId !== id)
        : [...selectedRows, id]
    );
  };

  const handleSelectAllRows = () => {
    setSelectedRows(
      selectedRows.length === currentTransactions.length
        ? []
        : currentTransactions.map((transaction) => transaction.id)
    );
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeSidebar = () => {
    setSelectedTransaction(null);
    setTransactionDetails(null);
    setErrorDetails(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",
      Completed: "bg-green-50 text-green-700 ring-green-200",
      Failed: "bg-red-50 text-red-700 ring-red-200",
      Active: "bg-blue-50 text-blue-700 ring-blue-200",
      Succeeded: "bg-green-50 text-green-700 ring-green-200",
    };
    const dotStyles = {
      Pending: "bg-yellow-400",
      Completed: "bg-green-400",
      Failed: "bg-red-400",
      Active: "bg-blue-400",
      Succeeded: "bg-green-400",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
          styles[status] || "bg-gray-50 text-gray-700 ring-gray-200"
        } ring-1 ring-inset`}
      >
        <span className={`w-2 h-2 rounded-full ${dotStyles[status] || "bg-gray-400"} mr-2`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDownloadReceipt = () => {
    if (!transactionDetails) {
      alert("No receipt available for this transaction.");
      return;
    }

    if (transactionDetails.receiptUrl) {
      try {
        window.open(transactionDetails.receiptUrl, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Error opening receipt URL:", error);
        alert("Failed to open receipt.");
      }
    } else if (transactionDetails.pdf) {
      try {
        const byteCharacters = atob(transactionDetails.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt-${transactionDetails.transactionId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading receipt:", error);
        alert("Failed to download receipt.");
      }
    } else {
      alert("No receipt available for this transaction.");
    }
  };

  const getPaginationPages = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  console.log("TransactionTable rendered");

  return (
    <div className="relative">
      <div className="max-h-[500px] overflow-y-auto overflow-x-auto border rounded-md">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === currentTransactions.length &&
                    currentTransactions.length > 0
                  }
                  onChange={handleSelectAllRows}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-blue-400"
                />
              </th>
              <th className="p-4 text-left font-medium text-gray-600">Date</th>
              <th className="p-4 text-left font-medium text-gray-600">Description</th>
              <th className="p-4 text-left font-medium text-gray-600">Amount</th>
              <th className="p-4 text-left font-medium text-gray-600">Payment Method</th>
              <th className="p-4 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-600">
                  No transactions found.
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => (
                <tr
                  key={transaction.key}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(transaction)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(transaction.id)}
                      onChange={() => handleSelectRow(transaction.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-blue-400"
                    />
                  </td>
                  <td className="p-4">{transaction.formattedDate}</td>
                  <td className="p-4">{transaction.description}</td>
                  <td className="p-4">{transaction.amount}</td>
                  <td className="p-4">{transaction.paymentMethod}</td>
                  <td className="p-4">{getStatusBadge(transaction.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <div
          className="fixed top-0 right-0 h-full w-[420px] backdrop-blur-xl bg-white border-l border-purple-200 shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto"
          role="dialog"
          aria-labelledby="sidebar-title"
        >
          <div className="p-6 flex flex-col h-full text-gray-900 font-sans">
            <div className="flex justify-between items-center mb-6 border-b border-purple-100 pb-4">
              <h2 className="text-xl font-semibold text-purple-800 tracking-tight" id="sidebar-title">
                💼 Transaction Details
              </h2>
              <button
                onClick={closeSidebar}
                className="rounded hover:bg-purple-50 p-2 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-purple-600" />
              </button>
            </div>

            <div className="flex-grow space-y-6 text-sm">
              {isLoadingDetails ? (
                <div className="text-center text-gray-600">Loading details...</div>
              ) : errorDetails ? (
                <div className="text-center text-red-600">{errorDetails}</div>
              ) : transactionDetails ? (
                <>
                  <DetailRowPurple label="Transaction ID" value={transactionDetails.transactionId} />
                  <DetailRowPurple label="Date" value={formatDate(transactionDetails.timestamp)} />
                  <DetailRowPurple label="Description" value={transactionDetails.description || "N/A"} />
                  <DetailRowPurple
                    label="Amount"
                    value={`${transactionDetails.amount < 0 ? "-" : ""}$${Math.abs(transactionDetails.amount ).toFixed(2)}`}
                    className="text-lg font-bold text-purple-800"
                  />
                      <DetailRowPurple
                    label="Type"
                    value={transactionDetails.type.charAt(0).toUpperCase() + transactionDetails.type.slice(1)}
                    className={transactionDetails.type === "debit" ? "text-red-600" : "text-green-600"}
                  />
                  <DetailRowPurple
                    label="Payment Method"
                    value={
                      transactionDetails.transactionCategory === "withdrawal"
                        ? "Bank Transfer"
                        : transactionDetails.transactionCategory === "topup"
                        ? "Debit/Credit Card"
                        : "Wallet"
                    }
                  />
                  <DetailRowPurple label="From" value={transactionDetails.fromFullName} />
                  <DetailRowPurple label="To" value={transactionDetails.toFullName} />
                  
                  <div className="grid grid-cols-3 gap-2 items-baseline">
                    <span className="col-span-1 text-purple-600 font-medium">Status</span>
                    <span className="col-span-2">{getStatusBadge(transactionDetails.status)}</span>
                  </div>
                  
                </>
                
              ) : (
                <div className="text-center text-gray-600">No details available.</div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleDownloadReceipt}
                disabled={isLoadingDetails || (!transactionDetails?.pdf && !transactionDetails?.receiptUrl)}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                View Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {getPaginationPages().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const RecurringPaymentTable: React.FC<RecurringPaymentTableProps> = ({
  recurringPayments,
  searchQuery,
  statusFilter,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRecurringPayments, setFilteredRecurringPayments] = useState<RecurringPayment[]>([]);
  const [selectedRecurringPayment, setSelectedRecurringPayment] = useState<RecurringPayment | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  // Format date for display
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    let filtered = recurringPayments;

    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          (payment.recipientFullName || "Unknown")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          payment.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.frequency.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    setFilteredRecurringPayments(filtered);
    setCurrentPage(1);
  }, [recurringPayments, searchQuery, statusFilter]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRecurringPayment(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const calculateTimeLeft = useCallback(() => {
    if (selectedRecurringPayment && selectedRecurringPayment.nextRun !== "N/A") {
      const nextRunDate = new Date(selectedRecurringPayment.nextRun);
      const now = new Date();
      const diff = nextRunDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Due now");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    } else {
      setTimeLeft("");
    }
  }, [selectedRecurringPayment]);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const totalPages = Math.ceil(filteredRecurringPayments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRecurringPayments.length);
  const currentRecurringPayments = filteredRecurringPayments.slice(startIndex, endIndex);

  const handleRowClick = (payment: RecurringPayment) => {
    setSelectedRecurringPayment(payment);
  };

  const closeSidebar = () => {
    setSelectedRecurringPayment(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",
      completed: "bg-green-50 text-green-700 ring-green-200",
      failed: "bg-red-50 text-red-700 ring-red-200",
      active: "bg-blue-50 text-blue-700 ring-blue-200",
      succeeded: "bg-green-50 text-green-700 ring-green-200",
    };
    const dotStyles = {
      pending: "bg-yellow-400",
      completed: "bg-green-400",
      failed: "bg-red-400",
      active: "bg-blue-400",
      succeeded: "bg-green-400",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
          styles[status.toLowerCase()] || "bg-gray-50 text-gray-700 ring-gray-200"
        } ring-1 ring-inset`}
      >
        <span className={`w-2 h-2 rounded-full ${dotStyles[status.toLowerCase()] || "bg-gray-400"} mr-2`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSendInstantPayment = async () => {
    if (!selectedRecurringPayment || !token) return;
    setIsSending(true);
    try {
      const amount = selectedRecurringPayment.amount
        ? parseFloat(selectedRecurringPayment.amount.replace("$", "")) * 100
        : 0;
      const payload = {
        recipientUserId: selectedRecurringPayment.recipientUserId,
        amount: amount,
        note: selectedRecurringPayment.note,
        transactionCategory: "wallet_transfer",
      };
      const response = await fetch("https://limpiar-backend.onrender.com/api/wallets/transactions/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to send instant payment");
      }
      alert("Instant payment sent successfully!");
    } catch (error) {
      console.error("Error sending instant payment:", error);
      alert("Failed to send instant payment.");
    } finally {
      setIsSending(false);
    }
  };

  const getPaginationPages = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  console.log("RecurringPaymentTable rendered");

  return (
    <div className="relative">
      <div className="max-h-[500px] overflow-y-auto overflow-x-auto border rounded-md">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-600">Recipient</th>
              <th className="p-4 text-left font-medium text-gray-600">Note</th>
              <th className="p-4 text-left font-medium text-gray-600">Frequency</th>
              <th className="p-4 text-left font-medium text-gray-600">Start Date</th>
              <th className="p-4 text-left font-medium text-gray-600">Next Run</th>
              <th className="p-4 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecurringPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-600">
                  No recurring payments found.
                </td>
              </tr>
            ) : (
              currentRecurringPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(payment)}
                >
                  <td className="p-4">{payment.recipientFullName || "Unknown"}</td>
                  <td className="p-4">{payment.note}</td>
                  <td className="p-4">{payment.frequency}</td>
                  <td className="p-4">{formatDate(payment.startDate)}</td>
                  <td className="p-4">{formatDate(payment.nextRun)}</td>
                  <td className="p-4">{getStatusBadge(payment.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRecurringPayment && (
        <div
          className="fixed top-0 right-0 h-full w-[420px] backdrop-blur-xl bg-white border-l border-purple-200 shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto"
          role="dialog"
          aria-labelledby="sidebar-title"
        >
          <div className="p-6 flex flex-col h-full text-gray-900 font-sans">
            <div className="flex justify-between items-center mb-6 border-b border-purple-100 pb-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-purple-600 animate-spin-slow"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Recurring Payment"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-purple-800 tracking-tight" id="sidebar-title">
                  Recurring Payment Details
                </h2>
              </div>
              <button
                onClick={closeSidebar}
                className="rounded hover:bg-purple-50 p-2 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-purple-600" />
              </button>
            </div>

            <div className="flex-grow space-y-6 text-sm">
              <DetailRowPurple label="Payment ID" value={selectedRecurringPayment._id} />
              <DetailRowPurple label="Sender" value={selectedRecurringPayment.senderFullName || "Unknown"} />
              <DetailRowPurple label="Recipient" value={selectedRecurringPayment.recipientFullName || "Unknown"} />
              {selectedRecurringPayment.amount && (
                <DetailRowPurple
                  label="Amount"
                  value={selectedRecurringPayment.amount}
                  className="text-lg font-bold text-purple-800"
                />
              )}
              <DetailRowPurple label="Note" value={selectedRecurringPayment.note || "N/A"} />
              <DetailRowPurple label="Frequency" value={selectedRecurringPayment.frequency} />
              <DetailRowPurple label="Start Date" value={formatDate(selectedRecurringPayment.startDate)} />
              <DetailRowPurple label="Next Run" value={formatDate(selectedRecurringPayment.nextRun)} />
              <DetailRowPurple label="Created At" value={formatDate(selectedRecurringPayment.createdAt)} />
              <DetailRowPurple label="Time Left" value={timeLeft || "Calculating..."} />
              <div className="grid grid-cols-3 gap-2 items-baseline">
                <span className="col-span-1 text-purple-600 font-medium">Status</span>
                <span className="col-span-2">{getStatusBadge(selectedRecurringPayment.status)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleSendInstantPayment}
                disabled={isSending || !selectedRecurringPayment.amount}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send Instant Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {getPaginationPages().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TransactionTables({ searchQuery, statusFilter }: { searchQuery: string; statusFilter: string }) {
  const [activeTab, setActiveTab] = useState<"transactions" | "recurring">("transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  const userWallet = useMemo(() => {
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
  }, []);

  const userId = userWallet?.user?.userId;

  const fetchUserDetails = useCallback(
    async (userId: string): Promise<string> => {
      try {
        const response = await fetch(`https://limpiar-backend.onrender.com/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          return userData.data.Fullname || userData.data.email || userId;
        }
        return userId;
      } catch (error) {
        console.error(`Error fetching user details for ${userId}:`, error);
        return userId;
      }
    },
    [token]
  );

  useEffect(() => {
    if (!userId || !token) {
      setError("User ID or authentication token is missing.");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const stripeResponse = await fetch(`https://limpiar-backend.onrender.com/api/payments/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!stripeResponse.ok) {
          const errorData = await stripeResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch Stripe payments (Status: ${stripeResponse.status})`);
        }

        const stripeData = await stripeResponse.json();

        const walletResponse = await fetch(`https://limpiar-backend.onrender.com/api/wallets/transactions/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!walletResponse.ok) {
          const errorData = await walletResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch wallet transactions (Status: ${walletResponse.status})`);
        }

        const walletData = await walletResponse.json();

        const stripeTransactions: Transaction[] = (stripeData.data || []).map((payment: any) => ({
          key: payment._id,
          id: payment._id,
          date: payment.createdAt,
          formattedDate: formatDate(payment.createdAt),
          description: payment.bookingId
            ? `Booking Payment, ${payment.bookingId.serviceType}`
            : "Wallet Top Up",
          amount: `$${((payment.amount || 0) ).toFixed(2)}`,
          paymentMethod: "Debit/Credit Card",
          status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          source: "stripe",
        }));

        const allWalletTransactions = [
          ...(walletData.wallet?.transactions?.debits || []),
          ...(walletData.wallet?.transactions?.credits || []),
          ...(walletData.wallet?.transactions?.transfers || []),
          ...(walletData.wallet?.transactions?.refunds || []),
        ];

        const walletTransactions: Transaction[] = allWalletTransactions.map((txn: any) => {
          // Handle wallet transfers for Credit/Debit classification
          if (txn.transactionCategory === "wallet_transfer" && txn.creditTransaction && txn.debitTransaction) {
            const isCredit = txn.creditTransaction.to === userId || txn.debitTransaction.to === userId;
            const selectedTxn = isCredit ? txn.creditTransaction : txn.debitTransaction;
            return {
              key: txn._id,
              id: txn.transactionId,
              date: txn.timestamp,
              formattedDate: formatDate(txn.timestamp),
              description: txn.description !== "No description provided" ? txn.description : "Wallet Transfer",
              amount: `${isCredit ? "" : "-"}$${Math.abs(selectedTxn.amount).toFixed(2)}`,
              paymentMethod: "Wallet",
              status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
              source: "wallet",
              type: isCredit ? "credit" : "debit",
            };
          }

          // Default handling for other transactions
          return {
            key: txn._id,
            id: txn.transactionId,
            date: txn.timestamp,
            formattedDate: formatDate(txn.timestamp),
            description:
              txn.description !== "No description provided"
                ? txn.description
                : txn.transactionCategory === "cleaning_payment"
                ? `Booking Payment`
                : txn.transactionCategory === "wallet_transfer"
                ? `Wallet Transfer`
                : txn.transactionCategory === "refund"
                ? `Refund`
                : txn.transactionCategory === "topup"
                ? `Wallet Top Up`
                : txn.transactionCategory === "withdrawal"
                ? `Withdrawal`
                : `Wallet ${txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}`,
            amount: `${txn.amount < 0 ? "-" : ""}$${Math.abs(txn.amount).toFixed(2)}`,
            paymentMethod:
              txn.transactionCategory === "withdrawal"
                ? "Bank Transfer"
                : txn.transactionCategory === "topup"
                ? "Debit/Credit Card"
                : "Wallet",
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            source: "wallet",
            type: txn.type,
          };
        });

        const combinedTransactions = [...stripeTransactions, ...walletTransactions].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (JSON.stringify(combinedTransactions) !== JSON.stringify(transactions)) {
          setTransactions(combinedTransactions);
        }

        const rawRecurringPayments = walletData?.wallet?.transactions?.recurringPayments || [];

        let normalizedRecurringPayments: RecurringPayment[] = rawRecurringPayments.map((payment: any) => ({
          _id: payment._id,
          senderUserId: payment.senderUserId,
          recipientUserId: payment.recipientUserId,
          senderFullName: payment.senderFullName || "Unknown",
          recipientFullName: payment.recipientFullName || "Unknown",
          note: payment.note || "N/A",
          frequency: payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1),
          startDate: payment.startDate,
          nextRun: payment.nextRun,
          status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          createdAt: payment.createdAt,
          amount: payment.amount ? `$${payment.amount.toFixed(2)}` : undefined, // Amount not in response
        }));

        normalizedRecurringPayments = normalizedRecurringPayments.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (JSON.stringify(normalizedRecurringPayments) !== JSON.stringify(recurringPayments)) {
          setRecurringPayments(normalizedRecurringPayments);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch transactions or recurring payments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, token, fetchUserDetails]);

  return (
    <div className="p-4">
      {isLoading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      <div className="mb-4 flex space-x-4">
      <button
  className={`px-4 py-2 rounded ${
    activeTab === "transactions" ? "bg-indigo-600 text-white" : "bg-gray-200 text-purple-900"
  }`}
  onClick={() => setActiveTab("transactions")}
>
  Transactions
</button>
<button
  className={`px-4 py-2 rounded ${
    activeTab === "recurring" ? "bg-indigo-600 text-white" : "bg-gray-200 text-purple-900"
  }`}
  onClick={() => setActiveTab("recurring")}
>
  Recurring Payments
</button>

      </div>
      {activeTab === "transactions" ? (
        <TransactionTable transactions={transactions} searchQuery={searchQuery} statusFilter={statusFilter} />
      ) : (
        <RecurringPaymentTable recurringPayments={recurringPayments} searchQuery={searchQuery} statusFilter={statusFilter} />
      )}
    </div>
  );
}
