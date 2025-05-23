"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { fetchCleaners, type Cleaner } from "../lib/services/cleanerService";

interface AssignCleanerModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (cleanerId: string) => void
  currentCleanerId?: string
}

export default function AssignCleanerModal({ 
  isOpen, 
  onClose, 
  onAssign,
  currentCleanerId 
}: AssignCleanerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCleaner, setSelectedCleaner] = useState<string | null>(null);
  const [availableCleaners, setAvailableCleaners] = useState<Cleaner[]>([]);
  const [filteredCleaners, setFilteredCleaners] = useState<Cleaner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, user } = useAppSelector((state) => state.auth);

  // Fetch available cleaners
  useEffect(() => {
    const getCleaners = async () => {
      if (!token || !user?._id) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const businessData = await fetchCleaners(user._id, token);

        if (businessData && businessData.cleaners) {
          // Filtering for verified and available cleaners wahala
          const verifiedCleaners = businessData.cleaners.filter(
            (cleaner) =>
              cleaner.availability === true && cleaner.identityVerified === true
          );
          setAvailableCleaners(verifiedCleaners);
          setFilteredCleaners(verifiedCleaners);
        } else {
          setAvailableCleaners([]);
          setFilteredCleaners([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch cleaners");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      getCleaners();
    }
  }, [token, user, isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCleaners(availableCleaners);
      return;
    }

    const filtered = availableCleaners.filter(
      (cleaner) =>
        cleaner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cleaner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cleaner.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCleaners(filtered);
  }, [searchQuery, availableCleaners]);

  const handleCleanerSelect = (cleanerId: string) => {
    setSelectedCleaner(cleanerId);
  };

  const handleAssign = () => {
    if (selectedCleaner) {
      onAssign(selectedCleaner);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Assign Cleaner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : filteredCleaners.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No cleaners available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {filteredCleaners.map((cleaner) => (
    <div
      key={cleaner._id}
      className={`flex items-center gap-3 p-2 rounded-md ${
        cleaner._id === currentCleanerId 
          ? "bg-gray-100 cursor-not-allowed" 
          : "hover:bg-gray-50 cursor-pointer"
      }`}
      onClick={() => cleaner._id !== currentCleanerId && handleCleanerSelect(cleaner._id)}
    >
      <input
        type="checkbox"
        checked={selectedCleaner === cleaner._id}
        onChange={() => cleaner._id !== currentCleanerId && handleCleanerSelect(cleaner._id)}
        className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
          cleaner._id === currentCleanerId ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={cleaner._id === currentCleanerId}
      />
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {cleaner.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{cleaner.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {cleaner.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedCleaner || isLoading}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCleaner && !isLoading
                ? "bg-[#4C41C0] text-white hover:bg-[#4C41C0]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
