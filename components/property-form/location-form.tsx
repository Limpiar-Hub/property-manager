"use client"

import { useAppDispatch } from "@/hooks/useReduxHooks"
import { setLocation } from "@/redux/features/addProperty/propertySlice"
import { MapPin } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import GoogleMapComponent from "../goggleMap"

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

  let GoogleMApApiKey: string
  if (process.env.NEXT_PUBLIC_API_KEY) {
    GoogleMApApiKey = process.env.NEXT_PUBLIC_API_KEY;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Where is your property located?</h2>
      <p className="text-center text-gray-500 mb-10">Search your address or find it on the map.</p>

      <div className="relative">
          <GoogleMapComponent apiKey={process.env.NEXT_PUBLIC_API_KEY ? process.env.NEXT_PUBLIC_API_KEY : ''} />
      </div>
    </div>
  )
}

