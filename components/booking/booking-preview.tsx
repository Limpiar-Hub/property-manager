"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
import { setStep, closeModal } from "@/redux/features/booking/bookingSlice"
import { ChevronLeft, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export default function BookingPreview() {
  const dispatch = useAppDispatch()
  const booking = useAppSelector((state) => state.booking)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleBack = () => {
    dispatch(setStep(5))
  }

  const handleSubmit = () => {

    setIsSubmitted(true)
  }

  const handleGoToBookings = () => {
    dispatch(closeModal())
    // redirect to the bookings page
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Cleaning Request</h2>
        <h3 className="text-xl font-bold mb-4">Received Successfully.</h3>

        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for submitting your details. Our team has received your information and will review it shortly. An
          administrator will reach out to you for any additional documentation required to complete the process. We
          appreciate your cooperation and look forward to assisting you further.
        </p>

        <Button onClick={handleGoToBookings} className="w-full max-w-md bg-blue-500 hover:bg-blue-600">
          Go to Bookings
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Booking Preview</h3>
        <button onClick={() => dispatch(closeModal())} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Service */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Service</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                // src={"/placeholder.svg"}
                src={booking.serviceType?.image || "/placeholder.svg"}
                alt={booking.serviceType?.name || "Service"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{booking.serviceType?.name}</p>
              <p className="text-sm">${booking.serviceType?.price}</p>
            </div>
          </div>
        </div>

        {/* Property */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Property</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                src={booking.property?.image || "/placeholder.svg"}
                alt={booking.property?.name || "Property"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-medium">{booking.property?.name}</p>
          </div>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Date</p>
          <p className="font-medium">
            {booking.date.type === "one-time" && booking.date.selectedDate}
            {booking.date.type === "multiple-day" &&
              booking.date.dateRange &&
              `${booking.date.dateRange.start} - ${booking.date.dateRange.end}`}
            {booking.date.type === "routine" && booking.date.routineDays && booking.date.routineDays.join(", ")}
          </p>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Time</p>
          <p className="font-medium">{booking.time}</p>
        </div>

        {/* Additional Note */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Additional note</p>
          <p>{booking.notes || "No additional notes provided."}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
          Submit Request
        </Button>
      </div>
    </div>
  )
}

