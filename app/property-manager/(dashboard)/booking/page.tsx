"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { openModal } from "@/redux/features/booking/bookingSlice";
import BookingModal from "@/components/booking/booking-modal";
import BookingsTable from "@/components/booking/bookings-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingTabs from "@/components/booking/booking-tabs";
import axios from "axios";
import { BookingStatus, Booking } from "@/types/booking";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const managerId = user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BookingStatus>("confirmed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!token || !managerId) return;

      const response = await axios.get(
        `https://limpiar-backend.onrender.com/api/bookings/history/${managerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: pagination.page,
            limit: pagination.limit,
            status: activeTab,
          },
        }
      );

      if (response.data) {
        setBookings(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, managerId, activeTab, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setPagination({
      page: 1,
      limit: Number(value),
      total: pagination.total,
    });
  };

  const counts = {
    confirmed: bookings.filter((b) => b.status?.toLowerCase() === "confirmed")
      .length,
    pending: bookings.filter((b) => b.status?.toLowerCase() === "pending")
      .length,
    completed: bookings.filter((b) => b.status?.toLowerCase() === "completed")
      .length,
    cancelled: bookings.filter((b) => b.status?.toLowerCase() === "cancelled")
      .length,
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-50">
          <div className="h-full w-1/3 bg-blue-400 animate-slide"></div>
        </div>
      )}

      <main className="pt-8 px-6 pb-20">
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
            currentPage={pagination.page}
            rowsPerPage={pagination.limit}
            totalBookings={pagination.total}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </main>
      <BookingModal />
    </div>
  );
}
