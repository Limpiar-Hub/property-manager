"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: (paymentMethod: "debit" | "ahc") => void
  amount: string
  setAmount: (amount: string) => void
}

export default function TopUpModal({ isOpen, onClose, onProceed, amount, setAmount }: TopUpModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "ahc">("debit")

  const handleProceed = () => {
    onProceed(paymentMethod)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Top Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Payments"
            />
          </div>

          <div className="text-sm text-gray-600">
            Available Balance: <span className="font-medium">${amount}</span>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-3">Choose your payment option:</p>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "debit"}
                  onChange={() => setPaymentMethod("debit")}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span>Debit / Credit Card</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "ahc"}
                  onChange={() => setPaymentMethod("ahc")}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span>A/C Transfer</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleProceed}
            className="w-full px-4 py-2 bg-[#4C41C0] text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  )
}
