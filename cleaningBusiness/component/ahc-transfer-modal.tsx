"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, X, Copy, Upload } from "lucide-react"

interface AHCTransferModalProps {
  isOpen: boolean
  onClose: () => void
  amount: string
  onBack: () => void
}

export default function AHCTransferModal({ isOpen, onClose, amount, onBack }: AHCTransferModalProps) {
  const [file, setFile] = useState<File | null>(null)

  const accountDetails = {
    accountHolder: "Cleaning Business",
    accountNumber: "66306873",
    iban: "GB81CLJI23456788999909",
    swiftCode: "SDLJNIP1334",
    bankName: "Super Bank Limited",
    bankAddress: "4th Floor Imperial House, 15 London, United state WC2B 6UN",
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process payment
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Top Up with AHC Transfer</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className="text-3xl font-bold">${amount}</p>
          </div>

          <p className="text-sm text-gray-700">Make a transfer to your account details below</p>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Holder</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.accountHolder}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.accountHolder)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.accountNumber}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.accountNumber)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">IBAN</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.iban}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.iban)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Swift Code</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.swiftCode}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.swiftCode)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.bankName}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.bankName)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Bank Address</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{accountDetails.bankAddress}</p>
                <button type="button" onClick={() => handleCopy(accountDetails.bankAddress)} className="text-primary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Upload Receipt or screenshot</p>
            <div
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("receipt-upload")?.click()}
            >
              <input
                type="file"
                id="receipt-upload"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag and Drop file here to or</p>
                  <p className="text-sm font-medium text-primary">Choose File</p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">File Format: jpeg, png</p>
            <p className="text-xs text-gray-500">Maximum Size: 25MB</p>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  )
}
