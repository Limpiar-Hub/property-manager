"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Cleaner } from "../lib/types"

const allCleaners: Cleaner[] = [
  { id: 1, name: "Jerome Bell", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 2, name: "Brooklyn Simmons", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 3, name: "Darrell Steward", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 4, name: "Cody Fisher", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 5, name: "Dianne Russell", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 6, name: "Arlene McCoy", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 7, name: "Albert Flores", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 8, name: "Ralph Edwards", title: "Cleaner", image: "/craig.png", status: "active" },
  { id: 9, name: "Cameron Williamson", title: "Cleaner", image: "/craig.png", status: "inactive" },
  { id: 10, name: "Jacob Jones", title: "Cleaner", image: "/craig.png", status: "inactive" },
  { id: 11, name: "Eleanor Pena", title: "Cleaner", image: "/craig.png", status: "inactive" },
  { id: 12, name: "Ronald Richards", title: "Cleaner", image: "/craig.png", status: "inactive" },
]

interface CleanerGridProps {
  activeTab: "active" | "inactive"
  searchQuery: string
}

export default function CleanerGrid({ activeTab, searchQuery }: CleanerGridProps) {
  const [filteredCleaners, setFilteredCleaners] = useState<Cleaner[]>([])

  useEffect(() => {
   
    const filtered = allCleaners.filter(
      (cleaner) => cleaner.status === activeTab && cleaner.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredCleaners(filtered)
  }, [activeTab, searchQuery])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCleaners.map((cleaner) => (
        <Link key={cleaner.id} href={`/cleaners/${cleaner.id}`} className="block">
          <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-4 aspect-h-3">
              <Image
                src={cleaner.image || "/placeholder.svg"}
                alt={cleaner.name}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{cleaner.name}</h3>
              <p className="text-gray-500 text-sm">{cleaner.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
