"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"


const transactions = [
  {
    id: 1,
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: "$ 100.00",
    paymentMethod: "Wallet Transaction",
    status: "Pending",
  },
  {
    id: 2,
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: "$ 100.00",
    paymentMethod: "Debit/credit Card Transaction",
    status: "Completed",
  },
  {
    id: 3,
    date: "11 June, 2025",
    description: "Wallet Top",
    amount: "$ 100.00",
    paymentMethod: "Debit/credit Card Transaction",
    status: "Failed",
  },
  {
    id: 4,
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: "$ 100.00",
    paymentMethod: "AHC Transfer",
    status: "Pending",
  },
  {
    id: 5,
    date: "10 June, 2025",
    description: "Wallet Top",
    amount: "$ 200.00",
    paymentMethod: "Debit/credit Card Transaction",
    status: "Completed",
  },
  {
    id: 6,
    date: "9 June, 2025",
    description: "Booking Payment, Azure Haven",
    amount: "$ 150.00",
    paymentMethod: "Wallet Transaction",
    status: "Completed",
  },
  {
    id: 7,
    date: "8 June, 2025",
    description: "Booking Payment, Emerald Heights",
    amount: "$ 120.00",
    paymentMethod: "AHC Transfer",
    status: "Pending",
  },
  {
    id: 8,
    date: "7 June, 2025",
    description: "Wallet Top",
    amount: "$ 500.00",
    paymentMethod: "Debit/credit Card Transaction",
    status: "Completed",
  },
  {
    id: 9,
    date: "6 June, 2025",
    description: "Booking Payment, Sapphire Residences",
    amount: "$ 180.00",
    paymentMethod: "Wallet Transaction",
    status: "Completed",
  },
  {
    id: 10,
    date: "5 June, 2025",
    description: "Booking Payment, Crystal Gardens",
    amount: "$ 90.00",
    paymentMethod: "AHC Transfer",
    status: "Failed",
  },
  {
    id: 11,
    date: "4 June, 2025",
    description: "Wallet Top",
    amount: "$ 300.00",
    paymentMethod: "Debit/credit Card Transaction",
    status: "Completed",
  },
  {
    id: 12,
    date: "3 June, 2025",
    description: "Booking Payment, Diamond Plaza",
    amount: "$ 200.00",
    paymentMethod: "Wallet Transaction",
    status: "Pending",
  },
]

interface TransactionTableProps {
  searchQuery: string
  statusFilter: string
}

export default function TransactionTable({ searchQuery, statusFilter }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [selectedRows, setSelectedRows] = useState<number[]>([])


  useEffect(() => {
    let filtered = transactions

    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, statusFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, filteredTransactions.length)
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Handle row selection
  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Handle select all rows
  const handleSelectAllRows = () => {
    if (selectedRows.length === currentTransactions.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentTransactions.map((transaction) => transaction.id))
    }
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-yellow-700">Pending</span>
          </span>
        )
      case "Completed":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-green-700">Completed</span>
          </span>
        )
      case "Failed":
        return (
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-red-700">Failed</span>
          </span>
        )
      default:
        return status
    }
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
          showing {startIndex + 1}-{endIndex} of {filteredTransactions.length} rows
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
  )
}
