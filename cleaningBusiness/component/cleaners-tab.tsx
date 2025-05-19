"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const cleaners = [
  { id: 1, name: "Jerome Bell", image: "/placeholder.svg" },
  { id: 2, name: "Brooklyn Simmons", image: "/placeholder.svg" },
  { id: 3, name: "Darrell Steward", image: "/placeholder.svg" },
  { id: 4, name: "Cody Fisher", image: "/placeholder.svg" },
  { id: 5, name: "Dianne Russell", image: "/placeholder.svg" },
  { id: 6, name: "Arlene McCoy", image: "/placeholder.svg" },
  { id: 7, name: "Albert Flores", image: "/placeholder.svg" },
  { id: 8, name: "Ralph Edwards", image: "/placeholder.svg" },
]

export default function CleanersTab() {
  const [activeStatus, setActiveStatus] = useState<"active" | "inactive">("active")

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveStatus("active")}
            className={`px-4 py-2 rounded-md ${
              activeStatus === "active" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveStatus("inactive")}
            className={`px-4 py-2 rounded-md ${
              activeStatus === "inactive" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Inactive
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cleaners.map((cleaner) => (
          <Link key={cleaner.id} href={`/cleaning-business/cleaners/${cleaner.id}`} className="block">
            <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-4 aspect-h-3">
                <Image
                  src="/jerome.png"
                  alt={cleaner.name}
                  width={300}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{cleaner.name}</h3>
                <p className="text-gray-500 text-sm">Cleaner</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
