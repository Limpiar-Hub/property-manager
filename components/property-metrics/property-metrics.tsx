
"use client"

import { useState } from "react"
import { ArrowUpIcon, CopyIcon, BarChart4Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Booking {
  id: string;
  status: string;
  // Add other booking properties as needed
}

export interface PropertyMetricsProps {
  bookings: Booking[];
}

export default function PropertyMetrics({ bookings }: PropertyMetricsProps) {
  const [timeframe, setTimeframe] = useState("This Week")

  const countActive = bookings.filter((book) => book.status.toLowerCase().includes("confirm"));
  const countPending = bookings.filter((book) => book.status.toLowerCase().includes("pend"));
  const countCancelled = bookings.filter((book) => book.status.toLowerCase().includes("cancel"));
  // Removed unused countCompleted as it wasn't being used in the component

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Property Metrics</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bookings Card */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <h3 className="text-2xl md:text-3xl font-bold">{bookings.length}</h3>
            </div>
            <Button variant="ghost" size="icon">
              <CopyIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
              <p className="text-lg md:text-xl font-semibold">{countActive.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Bookings</p>
              <p className="text-lg md:text-xl font-semibold">{countPending.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cancelled Bookings</p>
              <p className="text-lg md:text-xl font-semibold">{countCancelled.length}</p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500 mr-4">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">21.9%</span>
            </div>
            <div className="text-gray-400 text-sm">
              <span className="mr-1">+50</span>
              <span>This Week</span>
            </div>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Payments</p>
              <h3 className="text-2xl md:text-3xl font-bold">$37,789</h3>
            </div>
            <Button variant="ghost" size="icon">
              <BarChart4Icon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Payments</p>
              <p className="text-lg md:text-xl font-semibold">$30,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
              <p className="text-lg md:text-xl font-semibold">$7,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cancelled Payments</p>
              <p className="text-lg md:text-xl font-semibold">$789</p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500 mr-4">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">21.9%</span>
            </div>
            <div className="text-gray-400 text-sm">
              <span className="mr-1">+$60</span>
              <span>This Week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}