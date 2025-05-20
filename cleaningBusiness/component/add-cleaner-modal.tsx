"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
// import { useAppSelector } from "@/lib/store/hooks"
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addCleaner } from "../lib/services/cleanerService";

interface AddCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (verificationLink: string) => void;
}

export default function AddCleanerModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCleanerModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      setError("User information not found. Please log in again.");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const cleanerData = {
        ...formData,
        cleaningBusinessId: user._id,
        role: "cleaner",
      };

      const response = await addCleaner(cleanerData, token);

      if (response.success && response.verificationLink) {
        onSubmit(response.verificationLink);
      } else {
        setError("Failed to add cleaner: " + response.message);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the cleaner");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Cleaner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter cleaner's full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter cleaner's email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="flex">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Onboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
