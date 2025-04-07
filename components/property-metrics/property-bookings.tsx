"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default function PropertyBookings({bookings}: any) {
  const [selectedRows, setSelectedRows] = useState<number[]>([1])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const countActive = bookings.filter((book: any) => book.status.toLowerCase().includes("confirm"));
  const countPending = bookings.filter((book: any) => book.status.toLowerCase().includes("pend"));
  const countCancelled = bookings.filter((book: any) => book.status.toLowerCase().includes("cancel"));
  const countCompleted = bookings.filter((book: any) => book.status.toLowerCase().includes("complete"));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">Property Bookings</h2>
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Tabs defaultValue="active" className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex">
              <TabsTrigger value="active" className="text-xs md:text-sm">
                Active ({countActive.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm">
                Pending ({countPending.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                Completed ({countCompleted.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs md:text-sm">
                Cancelled ({countCancelled.length})
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
                <th className="p-4 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.includes(booking._id)}
                      onCheckedChange={() => toggleRowSelection(booking._id)}
                    />
                  </td>
                  <td className="p-4">{booking.serviceType.split(" ").slice(0, 3).join(" ")}</td>
                  <td className="p-4">{booking.propertyId?.name}</td>
                  <td className="p-4">{booking.date.slice(0, 10)}</td>
                  <td className="p-4">{booking.startTime
                  }</td>
                  <td className="p-4">{booking.status}</td>
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

