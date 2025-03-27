"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { openModal } from "@/redux/features/booking/bookingSlice";
import BookingModal from "@/components/booking/booking-modal";
import BookingsTable from "@/components/booking/bookings-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingTabs from "@/components/booking/booking-tabs";
import axios from "axios";
import { useAppSelector } from "@/hooks/useReduxHooks";

export type BookingStatus = "active" | "pending" | "completed" | "cancelled";

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

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const token = authState.token;
  const user = authState.user || null;
  const managerId = user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BookingStatus>("active");
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

        const response = await axios.get(
          `https://limpiar-backend.onrender.com/api/bookings/history/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else {
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


  const counts = {
    active: bookings.filter((b) => b.status.toLowerCase() === "active").length,
    pending: bookings.filter((b) => b.status.toLowerCase() === "pending")
      .length,
    completed: bookings.filter((b) => b.status.toLowerCase() === "completed")
      .length,
    cancelled: bookings.filter((b) => b.status.toLowerCase() === "cancelled")
      .length,
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <main className="pt- px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold">Bookings</h1>
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[300px]"
                />
              </div>
              <Button
                onClick={() => dispatch(openModal())}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Booking
              </Button>
            </div>
          </div>

          <BookingTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={counts} 
          />

          <BookingsTable
            activeTab={activeTab}
            searchQuery={searchQuery}
            bookings={bookings}
          />
        </div>
      </main>
      <BookingModal />
    </div>
  );
}
