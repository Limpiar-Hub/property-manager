
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Transaction {
  id: string;
  date: string;
  formattedDate: string;
  description: string;
  amount: string;
  paymentMethod: string;
  status: string;
}

interface TransactionTableProps {
  searchQuery: string;
  statusFilter: string;
}

export default function TransactionTable({ searchQuery, statusFilter }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  // Retrieve userId from localStorage
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

  // Fetch transactions
  useEffect(() => {
    if (!userId || !token) {
      setError("User ID or authentication token is missing.");
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch Stripe payments
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

        // Fetch wallet transactions
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

        // Normalize Stripe transactions
        const stripeTransactions: Transaction[] = (stripeData.data || []).map((payment: any) => ({
          id: payment._id,
          date: payment.createdAt,
          formattedDate: new Date(payment.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          description: payment.bookingId
            ? `Booking Payment, ${payment.bookingId.serviceType}`
            : "Wallet Top Up",
          amount: `$${((payment.amount || 0)).toFixed(2)}`,
          paymentMethod: "Debit/Credit Card Transaction",
          status: payment.status === "succeeded" ? "Completed" : payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
        }));

        // Normalize wallet transactions
        const walletTransactions: Transaction[] = [
          ...(walletData.wallet?.transactions?.debits || []),
          ...(walletData.wallet?.transactions?.credits || []),
          ...(walletData.wallet?.transactions?.transfers || []),
          ...(walletData.wallet?.transactions?.refunds || []),
        ].map((txn: any) => ({
          id: txn._id,
          date: txn.timestamp,
          formattedDate: new Date(txn.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          description: txn.description !== "No description provided" ? txn.description : (
            txn.transactionCategory === "cleaning_payment" ? `Booking Payment` :
            txn.transactionCategory === "wallet_transfer" ? `Wallet Transfer` :
            txn.transactionCategory === "refund" ? `Refund` : `Wallet ${txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}`
          ),
          amount: `${txn.amount < 0 ? "-" : ""}$${(Math.abs(txn.amount)).toFixed(2)}`,
          paymentMethod: txn.transactionCategory === "wallet_transfer" || txn.type === "debit" || txn.type === "credit"
            ? "Wallet Transaction"
            : txn.transactionCategory === "refund"
            ? "Refund"
            : "AHC Transfer",
          status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
        }));

        // Combine and sort by original timestamp (descending)
        const allTransactions = [...stripeTransactions, ...walletTransactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setFilteredTransactions(allTransactions);
      } catch (err: any) {
        console.error("Error fetching transactions:", err.message);
        setError(err.message || "Failed to load transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, token]);

  // Apply search and status filters
  useEffect(() => {
    let filtered = filteredTransactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, filteredTransactions]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTransaction(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredTransactions.length);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Handle row selection
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all rows
  const handleSelectAllRows = () => {
    if (selectedRows.length === currentTransactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentTransactions.map((transaction) => transaction.id));
    }
  };

  // Handle row click to open sidebar
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSelectedTransaction(null);
  };

  // Get status badge color and styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
            Pending
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-50 text-green-700 ring-1 ring-inset ring-green-200">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
            Completed
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-200">
            <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200">
            {status}
          </span>
        );
    }
  };

  // Get status-specific accent color for sidebar
  const getStatusAccentColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "from-yellow-50 to-white";
      case "Completed":
        return "from-green-50 to-white";
      case "Failed":
        return "from-red-50 to-white";
      default:
        return "from-gray-50 to-white";
    }
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentTransactions.length && currentTransactions.length > 0}
                  onChange={handleSelectAllRows}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="p-4 text-left font-medium text-gray-600">Date</th>
              <th className="p-4 text-left font-medium text-gray-600">Transaction Description</th>
              <th className="p-4 text-left font-medium text-gray-600">Amount</th>
              <th className="p-4 text-left font-medium text-gray-600">Payment Method</th>
              <th className="p-4 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(transaction)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => handleSelectRow(transaction.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="p-4">{transaction.formattedDate}</td>
                <td className="p-4">{transaction.description}</td>
                <td className="p-4">{transaction.amount}</td>
                <td className="p-4">{transaction.paymentMethod}</td>
                <td className="p-4">{getStatusBadge(transaction.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      {selectedTransaction && (
        <div
          className={`fixed top-0 right-0 h-full w-96 max-w-xs bg-white shadow-lg z-10 transform transition-all duration-300 ease-in-out bg-gradient-to-b ${getStatusAccentColor(selectedTransaction.status)}`}
          role="dialog"
          aria-labelledby="sidebar-title"
        >
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 id="sidebar-title" className="text-2xl font-semibold text-gray-800 tracking-tight">Transaction Details</h2>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-md bg-white/50 backdrop-blur-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-grow space-y-6">
              <div className="grid grid-cols-3 gap-2 items-baseline border-b border-gray-100 pb-4">
                <span className="col-span-1 text-sm font-medium text-gray-500">ID</span>
                <span className="col-span-2 text-sm text-gray-800 break-all">{selectedTransaction.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-baseline border-b border-gray-100 pb-4">
                <span className="col-span-1 text-sm font-medium text-gray-500">Date</span>
                <span className="col-span-2 text-sm text-gray-800">{selectedTransaction.formattedDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-baseline border-b border-gray-100 pb-4">
                <span className="col-span-1 text-sm font-medium text-gray-500">Description</span>
                <span className="col-span-2 text-sm text-gray-800">{selectedTransaction.description}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-baseline border-b border-gray-100 pb-4">
                <span className="col-span-1 text-sm font-medium text-gray-500">Amount</span>
                <span className="col-span-2 text-sm font-semibold text-gray-800">{selectedTransaction.amount}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-baseline border-b border-gray-100 pb-4">
                <span className="col-span-1 text-sm font-medium text-gray-500">Method</span>
                <span className="col-span-2 text-sm text-gray-800">{selectedTransaction.paymentMethod}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="col-span-1 text-sm font-medium text-gray-500">Status</span>
                <span className="col-span-2">{getStatusBadge(selectedTransaction.status)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-500">
          Rows per page:{" "}
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 ml-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{endIndex} of {filteredTransactions.length} rows
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded border disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded border disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
