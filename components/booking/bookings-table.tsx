





"use client";

import { useState } from "react";
import { Trash2, Edit, X } from "lucide-react";
import BookingDetailsSidebar from "./booking-details-sidebar";

interface Property {
  _id: string;
  name: string;
  address: string;
  type: string;
  subType: string;
  size: string;
  status: string;
  images: string[];
}

interface Booking {
  _id: string;
  propertyId: Property;
  date: string;
  startTime: string;
  status: string;
  price: number;
}

interface BookingsTableProps {
  activeTab: "active" | "pending" | "completed" | "cancelled";
  searchQuery: string;
  bookings: Booking[];
}

export default function BookingsTable({
  activeTab,
  searchQuery,
  bookings,
}: BookingsTableProps) {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredBookings = bookings
    .filter((booking) => booking.status.toLowerCase() === activeTab)
    .filter(
      (booking) =>
        booking.propertyId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.propertyId.address
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(filteredBookings.map((booking) => booking._id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, bookingId]);
    } else {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingId));
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeSidebar = () => {
    setSelectedProperty(null);
  };

  const showCheckboxes = activeTab === "pending" || activeTab === "completed";

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
          {/* ... (keep your existing table header) */}

          <thead>
            <tr className="bg-gray-50">
              {showCheckboxes && (
                <th className="p-3 sm:p-4 border border-gray-200">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === filteredBookings.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
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
            {filteredBookings.map((booking) => (
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
                    onClick={() => handlePropertyClick(booking.propertyId)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  >
                    {booking.propertyId.name}
                  </button>
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.propertyId.address}
                </td>

                <td className="p-3 sm:p-4 border border-gray-200">                   {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.startTime}
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.status}
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.price ? `$${booking.price}` : "N/A"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Property Details Sidebar */}
      {selectedProperty && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 z-40"></div>
          <BookingDetailsSidebar
            property={selectedProperty}
            onClose={closeSidebar}
          />
        </>
      )}
    </div>
  );
}