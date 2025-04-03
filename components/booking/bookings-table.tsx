

"use client";
import { useState } from "react";
import { Trash2, Edit, X } from "lucide-react";
import BookingDetailsSidebar from "./booking-details-sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingStatus } from "@/types/booking";

interface BookingsTableProps {
  activeTab: BookingStatus;
  searchQuery: string;
  bookings: any[];
  currentPage: number;
  rowsPerPage: number;
  totalBookings: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export default function BookingsTable({
  activeTab,
  searchQuery,
  bookings,
  currentPage,
  rowsPerPage,
  totalBookings,
  onPageChange,
  onRowsPerPageChange,
}: BookingsTableProps) {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const filteredBookings = bookings
    .filter((booking) => booking.status?.toLowerCase() === activeTab)
    .filter(
      (booking) =>
        booking.propertyId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.propertyId?.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelectAll = (checked: boolean) => {
    setSelectedBookings(
      checked ? filteredBookings.map((booking) => booking._id) : []
    );
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    setSelectedBookings(
      checked
        ? [...selectedBookings, bookingId]
        : selectedBookings.filter((id) => id !== bookingId)
    );
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
  };

  const closeSidebar = () => {
    setSelectedBooking(null);
  };

  const showCheckboxes = activeTab === "pending" || activeTab === "completed";
  const totalPages = Math.ceil(totalBookings / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalBookings);

  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 relative">
      {selectedBookings.length > 0 && (
        <div className="mb-4 flex gap-4">
          {activeTab === "pending" && (
            <>
              <button className="flex items-center gap-2 text-red-500">
                <X className="h-4 w-4" /> Cancel
              </button>
              <button className="flex items-center gap-2 text-red-500">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button className="flex items-center gap-2 text-blue-500">
                <Edit className="h-4 w-4" /> Update
              </button>
            </>
          )}
          {activeTab === "completed" && (
            <button className="flex items-center gap-2 text-red-500">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
      )}

      <div className="min-w-[1000px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {showCheckboxes && (
                <th className="p-3 sm:p-4 border border-gray-200">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === filteredBookings.length &&
                      filteredBookings.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={filteredBookings.length === 0}
                  />
                </th>
              )}
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Property Name
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Address
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Date
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Time
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Status
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking._id} className="bg-white hover:bg-gray-50">
                  {showCheckboxes && (
                    <td className="p-3 sm:p-4 border border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking._id)}
                        onChange={(e) =>
                          handleSelectBooking(booking._id, e.target.checked)
                        }
                      />
                    </td>
                  )}
                  <td className="p-3 sm:p-4 border border-gray-200">
                    <button
                      onClick={() => handleBookingClick(booking)}
                      className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                    >
                      {booking.propertyId?.name || "N/A"}
                    </button>
                  </td>
                  <td className="p-3 sm:p-4 border border-gray-200">
                    {booking.propertyId?.address || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border border-gray-200">
                    {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border border-gray-200">
                    {booking.startTime || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border border-gray-200">
                    {booking.status || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border border-gray-200">
                    {booking.price ? `$${booking.price.toFixed(2)}` : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showCheckboxes ? 7 : 6}
                  className="p-4 text-center text-gray-500"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            Showing {startRow}-{endRow} of {totalBookings} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded text-sm ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1 rounded border ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {selectedBooking && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 z-40"></div>
          <BookingDetailsSidebar
            booking={selectedBooking}
            onClose={closeSidebar}
          />
        </>
      )}
    </div>
  );
}