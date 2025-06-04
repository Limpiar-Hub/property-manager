"use client"

import { useState } from "react"
import { Search, CreditCard, RefreshCw, Send, DollarSign } from "lucide-react"
import { useDispatch } from "react-redux"
import WalletCard from "@/cleaningBusiness/component/wallet-card"
import TransactionTable from "@/cleaningBusiness/component/transaction-table"
import TopUpModal from "@/cleaningBusiness/component/top-up-modal"
import DebitCardModal from "@/cleaningBusiness/component/debit-card-modal"
import AHCTransferModal from "@/cleaningBusiness/component/ahc-transfer-modal"

import { MakePaymentModal } from "@/cleaningBusiness/component/make-payment-modal"
import { openWithdrawModal, openMakePaymentModal } from "@/redux/features/paymentModalSlice/paymentModalSlice"

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [isDebitCardModalOpen, setIsDebitCardModalOpen] = useState(false)
  const [isAHCTransferModalOpen, setIsAHCTransferModalOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("1000.00")
  const dispatch = useDispatch()

  // Handle top up wallet button click
  const handleTopUpWallet = () => {
    setIsTopUpModalOpen(true)
  }

  // Handle request refund button click
  const handleRequestRefund = () => {
    // Assuming there's a Redux action to open RefundModal
    // You might need to import and dispatch it if not already handled
  }

  // Handle withdraw button click
  const handleWithdraw = () => {
    dispatch(openWithdrawModal())
  }

  // Handle make payment button click
  const handleMakePayment = () => {
    dispatch(openMakePaymentModal())
  }

  // Handle proceed to payment method
  const handleProceedToPayment = (paymentMethod: "debit" | "ahc") => {
    setIsTopUpModalOpen(false)
    if (paymentMethod === "debit") {
      setIsDebitCardModalOpen(true)
    } else {
      setIsAHCTransferModalOpen(true)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      {/* Wallet Balance Card */}
      <div className="mb-6">
        <WalletCard balance="1,000.00" />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-[15rem]">
        <button
          onClick={handleTopUpWallet}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="h-5 w-5" />
          Top Up Wallet
        </button>
        <button
          onClick={handleRequestRefund}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          Request Refund
        </button>
        <button
          onClick={handleWithdraw}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <DollarSign className="h-5 w-5" />
          Withdraw
        </button>
        <button
          onClick={handleMakePayment}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <Send className="h-5 w-5" />
          Make Payment
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Transaction Table */}
      <TransactionTable searchQuery={searchQuery} statusFilter={statusFilter} />

      {/* Modals */}
      {isTopUpModalOpen && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          onProceed={handleProceedToPayment}
          amount={topUpAmount}
          setAmount={setTopUpAmount}
        />
      )}

      {isDebitCardModalOpen && (
        <DebitCardModal
          isOpen={isDebitCardModalOpen}
          onClose={() => setIsDebitCardModalOpen(false)}
          amount={topUpAmount}
          onBack={() => {
            setIsDebitCardModalOpen(false)
            setIsTopUpModalOpen(true)
          }}
        />
      )}

      {isAHCTransferModalOpen && (
        <AHCTransferModal
          isOpen={isAHCTransferModalOpen}
          onClose={() => setIsAHCTransferModalOpen(false)}
          amount={topUpAmount}
          onBack={() => {
            setIsAHCTransferModalOpen(false)
            setIsTopUpModalOpen(true)
          }}
        />
      )}

      <RefundModal />
      <WithdrawModal />
      <MakePaymentModal />
    </div>
  )
}