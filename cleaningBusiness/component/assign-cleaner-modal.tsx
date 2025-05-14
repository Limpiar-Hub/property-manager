"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, X } from "lucide-react"
import type { Cleaner } from "../lib/types"


const availableCleaners: Cleaner[] = [
  { id: 1, name: "Cameron Williamson", image: "/craig.png" },
  { id: 2, name: "Jacob Jones", image: "/craig.png" },
  { id: 3, name: "Arlene McCoy", image: "/craig.png" },
  { id: 4, name: "Ronald Richards", image: "/craig.png" },
  { id: 5, name: "Eleanor Pena", image: "/craig.png" },
  { id: 6, name: "Cody Fisher", image: "/craig.png" },
  { id: 7, name: "Albert Flores", image: "/craig.png" },
]

interface AssignCleanerModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (cleaner: Cleaner) => void
}

export default function AssignCleanerModal({ isOpen, onClose, onAssign }: AssignCleanerModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner | null>(null)

 
  const filteredCleaners = availableCleaners.filter((cleaner) =>
    cleaner.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  const handleCleanerSelect = (cleaner: Cleaner) => {
    setSelectedCleaner(cleaner)
  }

  
  const handleAssign = () => {
    if (selectedCleaner) {
      onAssign(selectedCleaner)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Assign Cleaner</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {filteredCleaners.map((cleaner) => (
              <div
                key={cleaner.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => handleCleanerSelect(cleaner)}
              >
                <input
                  type="checkbox"
                  checked={selectedCleaner?.id === cleaner.id}
                  onChange={() => handleCleanerSelect(cleaner)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={cleaner.image || "/placeholder.svg"}
                    alt={cleaner.name}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium">{cleaner.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedCleaner}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCleaner
                ? "bg-primary text-white hover:bg-primary-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}
