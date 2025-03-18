"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  paymentMethod: string
  status: "pending" | "completed" | "failed"
}

const transactions: Transaction[] = [
  {
    id: "1",
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: 100.0,
    paymentMethod: "Wallet Transaction",
    status: "pending",
  },
  {
    id: "2",
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: 100.0,
    paymentMethod: "Debit/credit Card Transaction",
    status: "completed",
  },
  {
    id: "3",
    date: "11 June, 2025",
    description: "Wallet Top",
    amount: 100.0,
    paymentMethod: "Debit/credit Card Transaction",
    status: "failed",
  },
  {
    id: "4",
    date: "11 June, 2025",
    description: "Booking Payment, Opal Ridge",
    amount: 100.0,
    paymentMethod: "AHC Transfer",
    status: "pending",
  },
]

export function TransactionTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const toggleAllRows = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(transactions.map((t) => t.id))
    }
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Search and filter */}
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64" />
        </div>

        <div className="relative w-full md:w-48">
          <select className="w-full appearance-none border rounded-md px-4 py-2 pr-8 bg-white">
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Failed</option>
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
                  checked={selectedRows.length === transactions.length && transactions.length > 0}
                  onChange={toggleAllRows}
                />
              </th>
              <th className="p-4 text-left font-medium">Date</th>
              <th className="p-4 text-left font-medium">Transaction Description</th>
              <th className="p-4 text-left font-medium">Amount</th>
              <th className="p-4 text-left font-medium">Payment Method</th>
              <th className="p-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => toggleRow(transaction.id)}
                  />
                </td>
                <td className="p-4 text-sm">{transaction.date}</td>
                <td className="p-4 text-sm">{transaction.description}</td>
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
            <select className="w-full appearance-none border rounded-md px-2 py-1 pr-6 bg-white">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
          </div>
          <span className="ml-4">showing 1-10 of 30 rows</span>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-gray-500 hover:bg-gray-50">Previous</button>
          <button className="px-4 py-2 border rounded-md bg-gray-900 text-white hover:bg-gray-800">Next</button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "pending") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        <span className="text-yellow-600 text-sm">Pending</span>
      </div>
    )
  }

  if (status === "completed") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-green-600 text-sm">Completed</span>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
        <span className="text-red-600 text-sm">Failed</span>
      </div>
    )
  }

  return null
}

