"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Transaction {
  id: string;
  date: string;
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
          date: new Date(payment.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          description: payment.bookingId
            ? `Booking Payment, ${payment.bookingId.serviceType}`
            : "Wallet Top Up",
          amount: `$${((payment.amount || 0) ).toFixed(2)}`,
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
          date: new Date(txn.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          description: txn.description !== "No description provided" ? txn.description : (
            txn.transactionCategory === "cleaning_payment" ? `Booking Payment` :
            txn.transactionCategory === "wallet_transfer" ? `Wallet Transfer` :
            txn.transactionCategory === "refund" ? `Refund` : `Wallet ${txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}`
          ),
          amount: `${txn.amount < 0 ? "-" : ""}$${(Math.abs(txn.amount) ).toFixed(2)}`,
          paymentMethod: txn.transactionCategory === "wallet_transfer" || txn.type === "debit" || txn.type === "credit"
            ? "Wallet Transaction"
            : txn.transactionCategory === "refund"
            ? "Refund"
            : "AHC Transfer",
          status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
        }));

        // Combine and sort by date (descending)
        const allTransactions = [...stripeTransactions, ...walletTransactions].sort(
          (a, b) => new Date(b.date.split(" ").reverse().join("-")).getTime() - new Date(a.date.split(" ").reverse().join("-")).getTime()
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
  }, [searchQuery, statusFilter]);

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

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-yellow-700">Pending</span>
          </span>
        );
      case "Completed":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-green-700">Completed</span>
          </span>
        );
      case "Failed":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-red-700">Failed</span>
          </span>
        );
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
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
              <tr key={transaction.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => handleSelectRow(transaction.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="p-4">{transaction.date}</td>
                <td className="p-4">{transaction.description}</td>
                <td className="p-4">{transaction.amount}</td>
                <td className="p-4">{transaction.paymentMethod}</td>
                <td className="p-4">{getStatusBadge(transaction.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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