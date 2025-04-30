"use client";
import { useState } from "react";
import { X, CheckCircle, Clock, Home, Trash2, CalendarCheck, XCircle } from "lucide-react";
import BookingDetailsSidebar from "./booking-details-sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";
import ConfirmCancelModal from "./confirm-cancel-modal";
import axios from "axios";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { toast } from "sonner";

interface BookingsTableProps {
  activeTab: BookingStatus;
  searchQuery: string;
  bookings: Booking[];
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === activeTab &&
      (booking.propertyId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       booking.propertyId?.address?.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeSidebar = () => {
    setSelectedBooking(null);
  };

  const handleCancelBookings = async () => {
    try {
      setIsCancelling(true);
      await Promise.all(
        selectedBookings.map(async (bookingId) => {
          await axios.patch(
            `https://limpiar-backend.onrender.com/api/bookings/${bookingId}/cancel`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      toast.success("Bookings cancelled successfully");
      setSelectedBookings([]);
      setCancelModalOpen(false);
    } catch (error) {
      console.error("Error cancelling bookings:", error);
      toast.error("Failed to cancel bookings");
    } finally {
      setIsCancelling(false);
    }
  };

  const showCheckboxes = activeTab === "pending";
  const totalPages = Math.ceil(totalBookings / rowsPerPage);
  const hasData = totalBookings > 0;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalBookings);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "completed":
        return <CalendarCheck className="h-3.5 w-3.5 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusClasses = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 relative">
      {selectedBookings.length > 0 && showCheckboxes && (
        <div className="mb-4">
          <button
            onClick={() => setCancelModalOpen(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" /> Cancel Selected ({selectedBookings.length})
          </button>
        </div>
      )}

      <div className="relative">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full min-w-[1000px] table-fixed">
              <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  {showCheckboxes && (
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedBookings.length === filteredBookings.length &&
                          filteredBookings.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        disabled={filteredBookings.length === 0}
                        className="accent-blue-500 rounded"
                      />
                    </th>
                  )}
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Property Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                    Address
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Time
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-0`}
                    >
                      {showCheckboxes && (
                        <td className="p-4 w-12">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking._id)}
                            onChange={(e) =>
                              handleSelectBooking(booking._id, e.target.checked)
                            }
                            className="accent-blue-500 rounded"
                          />
                        </td>
                      )}
                      <td className="p-4 w-1/6">
                        <button
                          onClick={() => handleBookingClick(booking)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-sm font-medium"
                        >
                          <Home className="h-4 w-4" />
                          {booking.propertyId?.name || "N/A"}
                        </button>
                      </td>
                      <td className="p-4 w-1/4 text-sm text-gray-600">
                        {booking.propertyId?.address || "N/A"}
                      </td>
                      <td className="p-4 w-1/6 text-sm text-gray-600">
                        {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4 w-1/6 text-sm text-gray-600">
                        {booking.startTime || "N/A"}
                      </td>
                      <td className="p-4 w-1/6">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(booking.status)}`}
                        >
                          {getStatusIcon(booking.status || "N/A")}
                          {booking.status || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 w-1/6 text-sm text-gray-600">
                        {booking.price ? `$${booking.price.toFixed(2)}` : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="p-6 text-center text-gray-600 text-sm"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 z-0">
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-2 py-1.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!hasData}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              {hasData
                ? `Showing ${startRow}-${endRow} of ${totalBookings}`
                : "No records available"}
            </span>
          </div>
          {hasData && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
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
                      className={`w-9 h-9 rounded-md text-sm font-medium flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      } transition-colors`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <>
          <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm z-40" />
          <BookingDetailsSidebar
            booking={selectedBooking}
            onClose={closeSidebar}
            className="bg-white rounded-lg shadow-xl border border-gray-200"
          />
        </>
      )}

      <ConfirmCancelModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelBookings}
        loading={isCancelling}
        className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md"
      />
    </div>
  );
}