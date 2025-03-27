"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import axios from "axios";

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

export default function BookingTable() {
  const authState = useAppSelector((state) => state.auth); // Get the auth state
  const token = authState.token; // Extract the token from auth state
  const user = authState.user || null;
  const managerId = user?._id;
  // const userId = authState.id;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);

        if (!token || !managerId) {
          throw new Error("Authentication token or user ID is missing.");
        }

        // Fetch bookings from the API
        const response = await axios.get(
          `https://limpiar-backend.onrender.com/api/bookings/history/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched data:", response.data);

        // Access the bookings array from the response object
        if (response.data && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Unexpected response format. Please contact support.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token, managerId]);

  if (isLoading) {
    return <p className="text-center py-4">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-center py-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="min-w-[1000px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
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
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                Images
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="bg-white">
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.propertyId.name}
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {booking.propertyId.address}
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">
                  {new Date(booking.date).toLocaleDateString()}
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
                <td className="p-3 sm:p-4 border border-gray-200">
                  <div className="flex space-x-2">
                    {booking.propertyId.images.map((imageId) => (
                      <img
                        key={imageId}
                        src={`https://limpiar-backend.onrender.com/api/images/${imageId}`}
                        alt="Property"
                        className="w-16 h-16 object-cover rounded-md border border-gray-300"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
