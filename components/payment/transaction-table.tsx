"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "succeeded" | "Rejected" | "completed";
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAllRows = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((t) => t.id));
    }
  };

  // Function to format description based on payment method
  const getTransactionDescription = (transaction: Transaction) => {
    const method = transaction.paymentMethod?.toLowerCase();
    const amountFormatted = transaction.amount.toFixed(2);
    if (method === "wallet") {
      return `Wallet transaction for $${amountFormatted} `;
    } else if (method === "stripe") {
      return `Stripe transaction for $${amountFormatted} `;
    }
    return transaction.description;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" ||
      transaction.status === statusFilter ||
      (statusFilter === "succeeded" && transaction.status === "completed");
    const matchesSearch =
      transaction.paymentMethod
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  return (
    <div className="rounded-lg border">
      {/* Search and filter */}
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
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
            className="w-full appearance-none border-2 rounded-md px-4 py-2 pr-8 "
          >
            <option value={"all"}>All Status</option>
            <option value={"pending"}>Pending</option>
            <option value={"succeeded"}>Completed</option>
            <option value={"Rejected"}>Failed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b text-sm text-gray-600">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    selectedRows.length === transactions.length &&
                    transactions.length > 0
                  }
                  onChange={toggleAllRows}
                />
              </th>
              <th className="p-4 text-left font-medium">Date</th>
              <th className="p-4 text-left font-medium">
                Transaction Description
              </th>
              <th className="p-4 text-left font-medium">Amount</th>
              <th className="p-4 text-left font-medium">Payment Method</th>
              <th className="p-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((transaction) => (
              <tr key={transaction.id} className="border-b light:hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => toggleRow(transaction.id)}
                  />
                </td>
                <td className="p-4 text-sm">
                  {new Date(transaction.date).toDateString()}
                </td>
                <td className="relative max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis pr-5">
                  {getTransactionDescription(transaction)}
                </td>
                <td className="p-4 text-sm">$ {transaction.amount.toFixed(2)}</td>
                <td className="p-4 text-sm">{transaction.paymentMethod}</td>
                <td className="p-4">
                  <StatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span>Rows per page:</span>
          <div className="relative w-16">
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page
              }}
              value={rowsPerPage}
              className="w-full appearance-none border-2 rounded-md px-2 py-1 pr-6"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
          </div>
          <span className="ml-4">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-gray-500 disabled:text-gray-300 light:hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md bg-gray-900 disabled:bg-gray-500 text-white hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "pending") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        <span className="text-yellow-600 text-sm">Pending</span>
      </div>
    );
  }

  if (status === "succeeded" || status === "completed") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-green-600 text-sm">Completed</span>
      </div>
    );
  }

  if (status === "Rejected") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
        <span className="text-red-600 text-sm">Failed</span>
      </div>
    );
  }

  return null;
}