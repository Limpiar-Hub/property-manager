"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { fetchCleaners } from "@/cleaningBusiness/lib/services/cleanerService";

interface Task {
  _id: string;
  taskId: string;
  status: string;
  assignedAt: string;
  propertyName: string;
  bookingId: {
    _id: string;
    propertyId: {
      _id: string;
      name: string;
    };
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    notes?: string;
  };
}

interface Cleaner {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  worker_id: string;
  role: string;
  availability: boolean;
  identityVerified: boolean;
  tasks: Task[];
}

export default function CleanerDetail({ params }: { params: { id: string } }) {
  const [activeTaskType, setActiveTaskType] = useState<"active" | "completed">(
    "active"
  );
  const [cleaner, setCleaner] = useState<Cleaner | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const currentUserId = useAppSelector((state) => state.auth.user?._id);

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  useEffect(() => {
    const loadCleanerData = async () => {
      if (!token || !currentUserId) return;

      try {
        setLoading(true);
        const businessData = await fetchCleaners(currentUserId, token);
        const foundCleaner = businessData.cleaners.find(
          (c) => c._id === params.id
        );

        if (!foundCleaner) {
          throw new Error("Cleaner not found");
        }

        setCleaner(foundCleaner);
      } catch (error) {
        console.error("Failed to fetch cleaner details:", error);
        router.push("/cleaning-business/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadCleanerData();
  }, [params.id, token, router, currentUserId]);

  const activeTasks =
    cleaner?.tasks?.filter(
      (task) => task.bookingId?.status !== "Completed" && task.status !== "Done"
    ) || [];

  const completedTasks =
    cleaner?.tasks?.filter(
      (task) => task.bookingId?.status === "Completed" || task.status === "Done"
    ) || [];

  const displayedTasks =
    activeTaskType === "active" ? activeTasks : completedTasks;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <p className="text-gray-500 mb-4">Cleaner not found</p>
        <Link
          href="/cleaning-business/dashboard"
          className="text-primary hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Link
        href="/cleaning-business/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      {/* Cleaner Profile */}
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 text-2xl font-bold">
      {getInitials(cleaner.fullName)}
    </div>
        <div>
          <h1 className="text-2xl font-bold">{cleaner.fullName}</h1>
          <p className="text-gray-500">Cleaner</p>
          <div className="mt-2">
            <span
              className={`px-2 py-1 text-xs rounded ${
                activeTasks.length > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {activeTasks.length > 0 ? "Active" : "Available"}
            </span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded ${
                cleaner.identityVerified
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {cleaner.identityVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-400" />
          <span>{cleaner.phoneNumber || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-400" />
          <span>{cleaner.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 text-gray-400">ID:</span>
          <span className="font-mono text-sm">{cleaner.worker_id}</span>
        </div>
      </div>

      <hr className="my-6" />

      {/* Task Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTaskType("active")}
          className={`px-4 py-2 rounded-md ${
            activeTaskType === "active"
              ? "bg-gray-100 text-gray-900"
              : "bg-white text-gray-500"
          }`}
        >
          Active Tasks ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTaskType("completed")}
          className={`px-4 py-2 rounded-md ${
            activeTaskType === "completed"
              ? "bg-gray-100 text-gray-900"
              : "bg-white text-gray-500"
          }`}
        >
          Completed Tasks ({completedTasks.length})
        </button>
      </div>

      {/* Task List */}
      {displayedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500">
            {activeTaskType === "active"
              ? "No active tasks assigned"
              : "No completed tasks yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border rounded-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Service Type</p>
                  <p className="font-medium">
                    {task.bookingId.serviceType || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Property</p>
                  <p className="font-medium">{task.propertyName || "N/A"}</p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-medium">
                    {new Date(task.bookingId.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-medium">
                    {task.bookingId.startTime} - {task.bookingId.endTime}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Assigned On</p>
                  <p className="font-medium">
                    {new Date(task.assignedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
                  <p className="font-medium truncate">
                    {task.bookingId.notes || "None"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-t">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <p className="text-xs text-gray-500">Task Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "Assigned"
                        ? "bg-blue-100 text-blue-800"
                        : task.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">Booking Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.bookingId.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : task.bookingId.status === "Completed"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.bookingId.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
