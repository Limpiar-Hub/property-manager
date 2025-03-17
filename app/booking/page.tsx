"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { openModal } from "@/redux/features/booking/bookingSlice";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookingModal from "@/components/booking/booking-modal";
import BookingsTable from "@/components/booking/bookings-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingTabs from "@/components/booking/booking-tabs";

type BookingStatus = "active" | "pending" | "completed" | "cancelled";

const statusCounts = {
  active: 10,
  pending: 20,
  completed: 17,
  cancelled: 3,
};

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("completed");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <main className="pt- px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Status Tabs */}
          {/* <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
            {(Object.keys(statusCounts) as BookingStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`pb-4 px-2 text-sm font-medium relative whitespace-nowrap ${
                  activeStatus === status
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {statusCounts[status]})
              </button>
            ))}
          </div> */}

<BookingTabs activeTab={"active"} setActiveTab={function (tab: BookingStatus): void {
            throw new Error("Function not implemented.");
          } } counts={{
            active: 0,
            pending: 0,
            completed: 0,
            cancelled: 0
          }}/>

          {/* Bookings Table */}
          <BookingsTable status={activeStatus} searchQuery={searchQuery} />
        </div>
      </main>

      <BookingModal />
    </div>
  );
}
