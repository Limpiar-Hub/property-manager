"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
import { setProperty, setStep } from "@/redux/features/booking/bookingSlice"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const properties = [
  {
    id: "1",
    name: "Azure Haven",
    image: "/p1.png",
  },
  {
    id: "2",
    name: "Golden Crest Residences",
    image: "/p2.png",
  },
  {
    id: "3",
    name: "Sunset Grove Residences",
    image: "/p3.png",
  },
  {
    id: "4",
    name: "Serenity Springs Villas",
    image: "/p4.png",
  },
  {
    id: "5",
    name: "Evergreen Heights",
    image: "/p5.png",
  },
  {
    id: "6",
    name: "Azure Haven",
    image: "/p6.png",
  },
]

export default function PropertyStep() {
  const dispatch = useAppDispatch()
  const { property } = useAppSelector((state) => state.booking)

  const handleBack = () => {
    dispatch(setStep(1))
  }

  const handleNext = () => {
    if (property) {
      dispatch(setStep(3))
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select property</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {properties.map((prop) => (
          <div
            key={prop.id}
            onClick={() => dispatch(setProperty(prop))}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all
              ${property?.id === prop.id ? "border-blue-500" : "border-transparent hover:border-gray-200"}`}
          >
            <Image
              src={prop.image || "/placeholder.svg"}
              alt={prop.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            {property?.id === prop.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="p-3">
              <h4 className="font-medium">{prop.name}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleNext}
          disabled={!property}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

