"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default function PropertyBookings() {
  const [selectedRows, setSelectedRows] = useState<number[]>([1])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const bookings = [
    {
      id: 1,
      serviceType: "Cleaning",
      property: "Opal Ridge Retreat",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Craig provided great insight a...",
      payment: "Pending",
    },
    {
      id: 2,
      serviceType: "Pool Cleaning",
      property: "Sunset Villa",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Had a great and fruitful discu...",
      payment: "Pending",
    },
    {
      id: 3,
      serviceType: "Cleaning",
      property: "Opal Ridge Retreat",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Peter was amazing! He share...",
      payment: "Pending",
    },
    {
      id: 4,
      serviceType: "Cleaning",
      property: "Opal Ridge Retreat",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Barbara is one of the most in...",
      payment: "Pending",
    },
    {
      id: 5,
      serviceType: "Pool Cleaning",
      property: "Sunset Villa",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Nicolas helped me a lot with a...",
      payment: "Pending",
    },
    {
      id: 6,
      serviceType: "Gardening",
      property: "Maple Grove estate",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Again a very valuable meet...",
      payment: "Pending",
    },
    {
      id: 7,
      serviceType: "Gardening",
      property: "Maple Grove estate",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Had an excellent call with Au...",
      payment: "Pending",
    },
    {
      id: 8,
      serviceType: "Gardening",
      property: "Maple Grove estate",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "I had an instant connection w...",
      payment: "Pending",
    },
    {
      id: 9,
      serviceType: "Gardening",
      property: "Maple Grove estate",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "An amazing mentor! Vassilen...",
      payment: "Pending",
    },
    {
      id: 10,
      serviceType: "Pool Cleaning",
      property: "Sunset Villa",
      date: "11 June, 2025",
      time: "11:50 am",
      note: "Vassilena was very open and...",
      payment: "Pending",
    },
  ]

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">Property Bookings</h2>
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Tabs defaultValue="active" className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex">
              <TabsTrigger value="active" className="text-xs md:text-sm">
                Active (10)
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm">
                Pending (2)
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                Completed (17)
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs md:text-sm">
                Cancelled (3)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-sm text-gray-500">{selectedRows.length} column selected</div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PencilIcon className="h-4 w-4" />
            Update Booking
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left w-12">
                  <Checkbox />
                </th>
                <th className="p-4 text-left font-medium text-gray-500">Service Type</th>
                <th className="p-4 text-left font-medium text-gray-500">Property</th>
                <th className="p-4 text-left font-medium text-gray-500">Date</th>
                <th className="p-4 text-left font-medium text-gray-500">Time</th>
                <th className="p-4 text-left font-medium text-gray-500">Additional Note</th>
                <th className="p-4 text-left font-medium text-gray-500">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.includes(booking.id)}
                      onCheckedChange={() => toggleRowSelection(booking.id)}
                    />
                  </td>
                  <td className="p-4">{booking.serviceType}</td>
                  <td className="p-4">{booking.property}</td>
                  <td className="p-4">{booking.date}</td>
                  <td className="p-4">{booking.time}</td>
                  <td className="p-4 max-w-[200px] truncate">{booking.note}</td>
                  <td className="p-4">{booking.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <select
              className="border rounded p-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500 ml-4 hidden sm:inline">showing 1-10 of 30 rows</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

