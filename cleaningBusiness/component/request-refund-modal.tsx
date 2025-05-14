"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface RequestRefundModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestRefundModal({ isOpen, onClose }: RequestRefundModalProps) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process refund request
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Request Refund</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="refund-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount
            </label>
            <input
              type="text"
              id="refund-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label htmlFor="refund-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Refund
            </label>
            <textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-32 resize-none"
              placeholder="Please provide a reason for your refund request"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}
