"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
import { setServiceType, setStep } from "@/redux/features/booking/bookingSlice"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "1",
    name: "Cleaning",
    price: 100,
    image: "/cleaning.png",
  },
  {
    id: "2",
    name: "Furniture Cleaning",
    price: 75,
    image: "/furniture-cleaning.png",
  },
  {
    id: "3",
    name: "Janitorial",
    price: 75,
    image: "/janitorial.png",
  },
  {
    id: "4",
    name: "Kitchen Cleaning",
    price: 58,
    image: "/kitchen-cleaning.png",
  },
  {
    id: "5",
    name: "Bathroom Cleaning",
    price: 125,
    image: "/bathroom-cleaning.png",
  },
  {
    id: "6",
    name: "Window Cleaning",
    price: 32,
    image: "/window-cleaning.png",
  },
]

export default function ServiceTypeStep() {
  const dispatch = useAppDispatch()
  const { serviceType } = useAppSelector((state) => state.booking)

  const handleNext = () => {
    if (serviceType) {
      dispatch(setStep(2))
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Service Type</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => dispatch(setServiceType(service))}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all
              ${serviceType?.id === service.id ? "border-blue-500" : "border-transparent hover:border-gray-200"}`}
          >
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            {serviceType?.id === service.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="p-3">
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-gray-600">${service.price}+</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleNext}
          disabled={!serviceType}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

