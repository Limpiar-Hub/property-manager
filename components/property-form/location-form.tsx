"use client"

import { useAppDispatch } from "@/hooks/useReduxHooks"
import { setLocation } from "@/redux/features/addProperty/propertySlice"
import { MapPin } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const suggestions = [
  { id: 1, main: "Queens", sub: "NY, USA" },
  { id: 2, main: "Queens Center", sub: "NY, USA" },
  { id: 3, main: "Queens Place Mall", sub: "NY, USA" },
  { id: 4, main: "Queens Boulevard", sub: "NY, USA" },
  { id: 5, main: "Queens Blvrd Woodside", sub: "NY, USA" },
]

export default function LocationForm() {
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSelectLocation = (suggestion: (typeof suggestions)[0]) => {
    const address = `${suggestion.main} ${suggestion.sub}`
    dispatch(
      setLocation({
        address,
        coordinates: { lat: 40.7282, lng: -73.7949 }, // Example coordinates for Queens
      }),
    )
    setSearch(address)
    setShowSuggestions(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Where is your property located?</h2>
      <p className="text-center text-gray-500 mb-10">Search your address or find it on the map.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowSuggestions(true)
              }}
              placeholder="Search location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {showSuggestions && (
            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  <div className="font-medium">{suggestion.main}</div>
                  <div className="text-sm text-gray-500">{suggestion.sub}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative h-[300px] bg-gray-100 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=300&width=400" alt="Map" fill className="object-cover" />
        </div>
      </div>
    </div>
  )
}

