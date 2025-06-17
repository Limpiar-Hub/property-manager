"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Verified, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://limpiar-backend.onrender.com/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userWallet = (() => {
    try {
      const stored = localStorage.getItem("userWallet");
      return stored ? JSON.parse(stored).data : null;
    } catch (e) {
      console.error("Error parsing userWallet from localStorage:", e);
      return null;
    }
  })();

  const userId = user?.id || userWallet?.user?.userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || !token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_API_URL}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch profile (Status: ${response.status})`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message || "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        {/* Back Button */}
        <div className="flex items-center text-blue-600 cursor-pointer mb-6" onClick={() => router.push("/partner/dashboard")}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium hover:underline">Back to Dashboard</span>
        </div>

        {/* Header with Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="text-blue-700 h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" aria-label="Loading profile" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-md">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {/* Profile Data */}
        {profileData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="mt-1 text-gray-800">{profileData.fullName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-800">{profileData.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="mt-1 text-gray-800">{profileData.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Verification Status</label>
                <p className="mt-1 flex items-center gap-2 text-gray-800">
                  {profileData.isVerified ? (
                    <>
                      <Verified className="h-5 w-5 text-green-600" aria-hidden="true" />
                      Verified
                    </>
                  ) : (
                    "Pending Verification"
                  )}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Business Address</label>
              <p className="mt-1 text-gray-800">
                {profileData.businessInfo?.address || "N/A"}, {profileData.businessInfo?.city || "N/A"},{" "}
                {profileData.businessInfo?.state || "N/A"} {profileData.businessInfo?.zipCode || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Operating City</label>
              <p className="mt-1 text-gray-800">{profileData.businessInfo?.operatingCity || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Services Provided</label>
              <p className="mt-1 text-gray-800">
                {profileData.businessInfo?.servicesYouProvide?.join(", ") || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Team Size</label>
              <p className="mt-1 text-gray-800">
                {profileData.businessInfo?.howManyTeamMembersDoYouHave || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Website</label>
              <p className="mt-1">
                {profileData.businessInfo?.website ? (
                  <a
                    href={profileData.businessInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profileData.businessInfo.website}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
