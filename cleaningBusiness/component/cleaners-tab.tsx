"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { fetchCleaners } from "../lib/services/cleanerService";

interface Cleaner {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  worker_id: string;
  role: string;
  availability: boolean;
  identityVerified: boolean;
  tasks: {
    taskId: string;
    bookingId: {
      status: string;
    };
    status: string;
  }[];
}

export default function CleanersTab() {
  const [activeStatus, setActiveStatus] = useState<"active" | "inactive">(
    "active"
  );
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useAppSelector((state) => state.auth.token);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const loadCleaners = async () => {
      if (!token || !currentUser?._id) return;

      try {
        setLoading(true);
        const response = await fetchCleaners(currentUser._id, token);
        setCleaners(response.cleaners || []);
      } catch (error) {
        console.error("Failed to fetch cleaners:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCleaners();
  }, [token, currentUser?._id]);

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  const filteredCleaners = cleaners.filter((cleaner) => {
    // Only show verified cleaners
    if (!cleaner.identityVerified) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !cleaner.fullName.toLowerCase().includes(query) &&
        !cleaner.email.toLowerCase().includes(query) &&
        !cleaner.phoneNumber.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by active/inactive status
    if (activeStatus === "active") {
      // Active cleaners have at least one ongoing task (status is not "Done")
      return cleaner.tasks?.some(
        (task) =>
          task.bookingId?.status !== "Completed" && task.status !== "Done"
      );
    } else {
      // Inactive cleaners are verified but have no ongoing tasks
      return !cleaner.tasks?.some(
        (task) =>
          task.bookingId?.status !== "Completed" && task.status !== "Done"
      );
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveStatus("active")}
            className={`px-4 py-2 rounded-md ${
              activeStatus === "active"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-500"
            }`}
          >
            Active (
            {
              cleaners.filter(
                (c) =>
                  c.identityVerified &&
                  c.tasks?.some(
                    (t) =>
                      t.bookingId?.status !== "Completed" && t.status !== "Done"
                  )
              ).length
            }
            )
          </button>
          <button
            onClick={() => setActiveStatus("inactive")}
            className={`px-4 py-2 rounded-md ${
              activeStatus === "inactive"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-500"
            }`}
          >
            Inactive (
            {
              cleaners.filter(
                (c) =>
                  c.identityVerified &&
                  !c.tasks?.some(
                    (t) =>
                      t.bookingId?.status !== "Completed" && t.status !== "Done"
                  )
              ).length
            }
            )
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {filteredCleaners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500">
            {activeStatus === "active"
              ? "No active cleaners found"
              : "No inactive cleaners found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCleaners.map((cleaner) => (
            <Link
              key={cleaner._id}
              href={`/partner/cleaners/${cleaner._id}`}
              className="block"
            >
              <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-4 aspect-h-3 flex items-center justify-center bg-gray-200">
                  <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-gray-700">
                    {getInitials(cleaner.fullName)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{cleaner.fullName}</h3>
                  <p className="text-gray-500 text-sm">Cleaner</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        activeStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activeStatus === "active" ? "Active" : "Available"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {cleaner.tasks?.length || 0} tasks
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
