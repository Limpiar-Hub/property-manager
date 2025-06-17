
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type Transaction = {
  key: string;
  id: string;
  date: string;
  formattedDate: string;
  description: string;
  amount: string;
  paymentMethod: string;
  status: string;
  source: "stripe" | "wallet";
  walletId?: string;
  type: string;
};

interface TransactionDetails {
  transactionId: string;
  amount: number;
  from: string;
  to: string;
  status: string;
  type: string;
  transactionCategory: string;
  description: string;
  timestamp: string;
  fromFullName: string;
  toFullName: string;
  pdf?: string;
  receiptUrl?: string;
};

interface TransactionTableProps {
  transactions: Transaction[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function DetailRowBlue({
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
      <span className="col-span-1 text-blue-600 font-medium">{label}</span>
      <span className={`col-span-2 break-words ${className}`}>{value}</span>
    </div>
  );
}

export function TransactionTable({ transactions: initialTransactions }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
  const userWalletId = userWallet?.walletId;

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
          type: "credit",
        }));

        const allWalletTransactions: Transaction[] = [];

        // Process debits
        (walletData.wallet?.transactions?.debits || []).forEach((txn: any) => {
          allWalletTransactions.push({
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
            amount: `${txn.amount < 0 ? "-" : ""}$${Math.abs(txn.amount ).toFixed(2)}`,
            paymentMethod:
              txn.transactionCategory === "withdrawal"
                ? "Bank Transfer"
                : txn.transactionCategory === "topup"
                ? "Debit/Credit Card"
                : "Wallet",
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            source: "wallet",
            walletId: txn.walletId,
            type: "debit",
          });
        });

        // Process credits
        (walletData.wallet?.transactions?.credits || []).forEach((txn: any) => {
          allWalletTransactions.push({
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
            amount: `${txn.amount < 0 ? "-" : ""}$${Math.abs(txn.amount ).toFixed(2)}`,
            paymentMethod:
              txn.transactionCategory === "withdrawal"
                ? "Bank Transfer"
                : txn.transactionCategory === "topup"
                ? "Debit/Credit Card"
                : "Wallet",
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            source: "wallet",
            walletId: txn.walletId,
            type: "credit",
          });
        });

        // Process transfers
        (walletData.wallet?.transactions?.transfers || []).forEach((txn: any) => {
          if (!txn.creditTransaction || !txn.debitTransaction) {
            console.warn(`Incomplete transfer transaction: ${txn.transactionId}`);
            return;
          }
          const isCredit = txn.creditTransaction?.to === userId || txn.debitTransaction?.to === userId;
          const selectedTxn = isCredit ? txn.creditTransaction : txn.debitTransaction;
          allWalletTransactions.push({
            key: txn._id || selectedTxn?._id,
            id: txn.transactionId,
            date: txn.timestamp,
            formattedDate: formatDate(txn.timestamp),
            description:
              txn.description !== "No description provided"
                ? txn.description
                : `Wallet Transfer`,
            amount: `${isCredit ? "" : "-"}$${Math.abs(selectedTxn.amount ).toFixed(2)}`,
            paymentMethod: "Wallet",
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            source: "wallet",
            walletId: selectedTxn.walletId,
            type: isCredit ? "credit" : "debit",
          });
        });

        // Process refunds
        (walletData.wallet?.transactions?.refunds || []).forEach((txn: any) => {
          allWalletTransactions.push({
            key: txn._id,
            id: txn.transactionId,
            date: txn.timestamp,
            formattedDate: formatDate(txn.timestamp),
            description: `Refund`,
            amount: `$${Math.abs(txn.amount / 100).toFixed(2)}`,
            paymentMethod: "Wallet",
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            source: "wallet",
            walletId: txn.walletId,
            type: "credit",
          });
        });

        const combinedTransactions = [...stripeTransactions, ...allWalletTransactions].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (JSON.stringify(combinedTransactions) !== JSON.stringify(transactions)) {
          setTransactions(combinedTransactions);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, token, userWalletId, fetchUserDetails]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === "succeeded" && transaction.status.toLowerCase() === "completed");
    const matchesSearch =
      transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
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
            const toFullName = await fetchUserDetails(payment.userId._id);
            setTransactionDetails({
              transactionId: payment._id,
              amount: payment.amount ,
              from: "Stripe",
              to: payment.userId._id,
              status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
              type: "credit",
              transactionCategory: "topup",
              description: payment.bookingId ? `Booking Payment` : "Wallet Top Up",
              timestamp: payment.createdAt,
              fromFullName: "Stripe",
              toFullName,
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
            let isCredit = false;

            if (data.debitTransaction && data.creditTransaction) {
              isCredit = data.creditTransaction.to === userId || data.debitTransaction.to === userId;
              txn = isCredit ? data.creditTransaction : data.debitTransaction;
            } else {
              txn = data.debitTransaction || data.creditTransaction;
              isCredit = txn.to === userId;
            }

            if (!txn) {
              throw new Error("No transaction data found in response");
            }

            let fromFullName = txn.from;
            let toFullName = txn.to;

            if (txn.from === "SYSTEM") {
              fromFullName = "System";
            } else if (txn.from === "internal-wallet") {
              fromFullName = "Wallet";
            } else if (txn.fromUser?.fullName) {
              fromFullName = txn.fromUser.fullName;
            } else if (/^[0-9a-f]{24}$/i.test(txn.from)) {
              fromFullName = await fetchUserDetails(txn.from);
            }

            if (txn.toUser?.fullName) {
              toFullName = txn.toUser.fullName;
            } else if (/^[0-9a-f]{24}$/i.test(txn.to)) {
              toFullName = await fetchUserDetails(txn.to);
            } else if (txn.to.includes("@")) {
              toFullName = txn.to;
            }

            if (txn.from === txn.to && /^[0-9a-f]{24}$/i.test(txn.from)) {
              fromFullName = `${fromFullName} (Self)`;
              toFullName = `${toFullName} (Self)`;
            }

            setTransactionDetails({
              transactionId: txn.transactionId,
              amount: Math.abs(txn.amount ),
              from: txn.from,
              to: txn.to,
              status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
              type: isCredit ? "credit" : "debit",
              transactionCategory: txn.transactionCategory,
              description: txn.description,
              timestamp: txn.timestamp,
              fromFullName,
              toFullName,
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
  }, [selectedTransaction, token, userId, fetchUserDetails]);

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",
      Completed: "bg-green-50 text-green-700 ring-green-200",
      Failed: "bg-red-50 text-red-700 ring-red-200",
      Succeeded: "bg-green-50 text-green-700 ring-green-200",
    };
    const dotStyles = {
      Pending: "bg-yellow-400",
      Completed: "bg-green-400",
      Failed: "bg-red-400",
      Succeeded: "bg-green-400",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
          styles[status] || "bg-gray-50 text-gray-700 ring-gray-200"
        } ring-1 ring-inset`}
      >
        <span className={`w-2 h-2 rounded-full ${dotStyles[status] || "bg-gray-400"} mr-2`} />
        {status}
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

  return (
    <div className="relative">
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4 bg-white rounded-t-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            value={searchQuery}
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
          />
        </div>

        <div className="relative w-full md:w-48">
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value)
            }
            className="w-full appearance-none border rounded-md px-4 py-2 pr-8 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {isLoading && <div className="text-center text-gray-600 p-4">Loading...</div>}
      {error && <div className="text-center text-red-600 p-4">{error}</div>}

      <div className="max-h-[500px] overflow-y-auto overflow-x-auto border rounded-b-md">
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
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
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
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
          className="fixed top-0 right-0 h-full w-[420px] backdrop-blur-xl bg-white border-l border-blue-200 shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto"
          role="dialog"
          aria-labelledby="sidebar-title"
        >
          <div className="p-6 flex flex-col h-full text-gray-900 font-sans">
            <div className="flex justify-between items-center mb-6 border-b border-blue-100 pb-4">
              <h2 className="text-xl font-semibold text-blue-800 tracking-tight" id="sidebar-title">
                💼 Transaction Details
              </h2>
              <button
                onClick={closeSidebar}
                className="rounded hover:bg-blue-50 p-2 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            <div className="flex-grow space-y-6 text-sm">
              {isLoadingDetails ? (
                <div className="text-center text-gray-600">Loading details...</div>
              ) : errorDetails ? (
                <div className="text-center text-red-600">{errorDetails}</div>
              ) : transactionDetails ? (
                <>
                  <DetailRowBlue label="Transaction ID" value={transactionDetails.transactionId} />
                  <DetailRowBlue label="Date" value={formatDate(transactionDetails.timestamp)} />
                  <DetailRowBlue label="Description" value={transactionDetails.description || "N/A"} />
                  <DetailRowBlue
                    label="Amount"
                    value={`${transactionDetails.type === "debit" ? "-" : ""}$${transactionDetails.amount.toFixed(2)}`}
                    className="text-lg font-bold text-blue-800"
                  />
                  <DetailRowBlue
                    label="Type"
                    value={
                      transactionDetails.transactionCategory === "withdrawal"
                        ? "Debit"
                        : transactionDetails.type.charAt(0).toUpperCase() + transactionDetails.type.slice(1)
                    }
                    className={
                      transactionDetails.transactionCategory === "withdrawal" || transactionDetails.type === "debit"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  />
                  <DetailRowBlue
                    label="Payment Method"
                    value={
                      transactionDetails.transactionCategory === "withdrawal"
                        ? "Bank Transfer"
                        : transactionDetails.transactionCategory === "topup"
                        ? "Debit/Credit Card"
                        : "Wallet"
                    }
                  />
                  <DetailRowBlue label="From" value={transactionDetails.fromFullName} />
                  <DetailRowBlue label="To" value={transactionDetails.toFullName} />
                  <div className="grid grid-cols-3 gap-2 items-baseline">
                    <span className="col-span-1 text-blue-600 font-medium">Status</span>
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
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
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
                  ? "bg-blue-600 text-white"
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
