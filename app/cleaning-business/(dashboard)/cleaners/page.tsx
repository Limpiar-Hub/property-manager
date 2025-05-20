"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import CleanerGrid from "@/cleaningBusiness/component/ cleaner-grid"
import AddCleanerModal from "@/cleaningBusiness/component/add-cleaner-modal"
import VerificationModal from "@/cleaningBusiness/component/verification-modal"

export default function CleanersPage() {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isVerifyingModal, setIsVerifyingModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationLink, setVerificationLink] = useState<string | undefined>(undefined)

  // const handleAddCleaner = () => {
  
  //   setIsAddModalOpen(false)
  //   setIsVerifyingModal(true)
  // }

  const handleAddCleaner = (link: string) => {
    // Close the add modal and show the verification modal with the link
    setIsAddModalOpen(false)
    setVerificationLink(link)
    setIsVerifyingModal(true)
  }

  const handleCloseVerificationModal = () => {
    setIsVerifyingModal(false)
    setVerificationLink(undefined)
    // Optionally refresh the cleaners list here
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Cleaners</h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4C41C0] text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Cleaner
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="inline-flex rounded-md overflow-hidden border">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2 ${activeTab === "active" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-6 py-2 ${activeTab === "inactive" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"}`}
          >
            Inactive
          </button>
        </div>
      </div>

      <CleanerGrid activeTab={activeTab} searchQuery={searchQuery} />

      {/* {isAddModalOpen && (
        <AddCleanerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddCleaner} />
      )}

      {isVerifyingModal && <VerificationModal isOpen={isVerifyingModal} onClose={() => setIsVerifyingModal(false)} />} */}

{isAddModalOpen && (
        <AddCleanerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddCleaner} />
      )}

      {isVerifyingModal && (
        <VerificationModal
          isOpen={isVerifyingModal}
          onClose={handleCloseVerificationModal}
          verificationLink={verificationLink}
        />
      )}
    </div>
  )
}
