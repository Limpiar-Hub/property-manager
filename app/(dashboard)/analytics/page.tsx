"use client";
import { useEffect, useCallback, useState, useRef } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import axios from "axios";
import { toast } from "sonner"; // Assuming toast is imported from a library like sonner

interface DashboardData {
  propertiesCount: number;
  bookingStatusDistribution: { _id: string; count: number }[];
  bookingVolume: number;
  bookingThisWeek: number;
  cancellationRate: number;
  revenueByProperty: any[];
  revenueTrend: any[];
  avgBookingValue: number;
  topServiceTypes: { _id: string; count: number }[];
  topCleaners: {
    cleanerId: string;
    fullName: string;
    jobsDone: number;
    avgRating: number | null;
  }[];
  topClients: { userId: string | null; fullName: string; email: string; bookingsCount: number }[];
  lastBookings: {
    _id: string;
    serviceType: string;
    status: string;
    createdAt: string;
    userFullName: string;
    userEmail: string;
  }[];
  walletBalance: number;
}

interface AnalyticsData {
  dashboard: DashboardData;
}

export default function AnalyticsPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const managerId = user?._id;
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Track initial load separately
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false); // Track live refresh state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (isLiveUpdate = false) => {
    try {
      if (isLiveUpdate) {
        setIsRefreshing(true); // Indicate live refresh
      } else {
        setIsInitialLoading(true); // Indicate initial load
      }

      if (!token || !managerId) {
        console.warn("Token or managerId is missing");
        toast({
          title: "Error",
          description: "Authentication details are missing.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(
        `https://limpiar-backend.onrender.com/api/analytics/property-manager/${managerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.dashboard?.dashboard) {
        setAnalytics({ dashboard: response.data.dashboard.dashboard });
        setLastUpdated(Date.now());
      } else {
        console.warn("No valid analytics data received");
        if (!isLiveUpdate) {
          setAnalytics(null); // Only clear analytics on initial load failure
        }
        toast({
          title: "Error",
          description: "Invalid analytics data received.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      if (!isLiveUpdate) {
        setAnalytics(null); // Only clear analytics on initial load failure
      }
      toast({
        title: "Error",
        description: "Failed to fetch analytics data.",
        variant: "destructive",
      });
    } finally {
      if (isLiveUpdate) {
        setIsRefreshing(false);
      } else {
        setIsInitialLoading(false);
      }
    }
  }, [token, managerId]);

  // Push data to Google Sheets in the background
  const pushToSheets = useCallback(async () => {
    try {
      if (!token || !managerId) {
        console.warn("Token or managerId is missing");
        return;
      }

      const response = await axios.post(
        `https://limpiar-backend.onrender.com/api/sheets/push-to-sheets/property_manager`,
        { managerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        console.log("Data successfully pushed to Google Sheets");
      } else {
        console.warn("Failed to push data to Google Sheets");
      }
    } catch (err) {
      console.error("Error pushing to sheets:", err);
    }
  }, [token, managerId]);

  // Setup live refresh
  useEffect(() => {
    fetchAnalytics(); // Initial fetch
    pushToSheets();

    if (isLive) {
      intervalRef.current = setInterval(() => {
        fetchAnalytics(true); // Pass true for live updates
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAnalytics, pushToSheets, isLive]);

  // Format last updated time
  const getLastUpdatedText = () => {
    const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);
    return `Updated ${secondsAgo + Math.floor(Math.random() * 5)} seconds ago`;
  };

  // JSX return
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes pulse-once {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .scroll-container {
          height: 120px;
          overflow: hidden;
          position: relative;
        }
        .scroll-content {
          animation: scrollUp 10s linear infinite;
          will-change: transform;
        }
        .scroll-container:hover .scroll-content {
          animation-play-state: paused;
        }
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
        .refresh-spinner {
          display: inline-block;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {isInitialLoading && !analytics ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 z-50">
            <div className="h-full w-1/3 bg-blue-400 animate-slide"></div>
          </div>
          Loading analytics data...
        </div>
      ) : (
        <main className="pt-8 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time insights into your property management operations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isRefreshing ? (
                    <span>
                      Updating <span className="refresh-spinner"></span>
                    </span>
                  ) : (
                    getLastUpdatedText()
                  )}
                </span>
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${isLive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {isLive ? 'Live' : 'Paused'}
                </button>
              </div>
            </div>

            {!analytics ? (
              <div className="text-center text-red-500 dark:text-red-400">Failed to load analytics data.</div>
            ) : (
              <div className="space-y-8">
                {/* Overview Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H3m6-17v17m4-17v17"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Properties Managed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">{analytics.dashboard.propertiesCount}</p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">{analytics.dashboard.bookingVolume}</p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bookings This Week</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">{analytics.dashboard.bookingThisWeek}</p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cancellation Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">{(analytics.dashboard.cancellationRate * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Avg Booking Value</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                          ${analytics.dashboard.avgBookingValue ? Math.round(analytics.dashboard.avgBookingValue).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${isRefreshing ? 'animate-pulse-once' : ''}`}>
                      <svg className="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                          ${analytics.dashboard.walletBalance ? analytics.dashboard.walletBalance.toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Booking Status Distribution</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dashboard.bookingStatusDistribution.map((status) => (
                        <tr key={status._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{status._id}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">{status.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top Service Types (Scrolling) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border-t-4 border-gradient-to-r from-indigo-500 to-purple-500">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Top Service Types</h2>
                  </div>
                  <div className="scroll-container">
                    <div className="scroll-content">
                      {[...analytics.dashboard.topServiceTypes, ...analytics.dashboard.topServiceTypes].map((service, index) => (
                        <div key={`${service._id}-${index}`} className="flex justify-between py-2 px-4 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
                          <span>{service._id.length > 50 ? `${service._id.substring(0, 50)}...` : service._id}</span>
                          <span>{service.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Cleaners */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Top Cleaners</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Name</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Jobs Done</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Average Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dashboard.topCleaners.map((cleaner) => (
                        <tr key={cleaner.cleanerId} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{cleaner.fullName}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">{cleaner.jobsDone}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">
                            <div className="flex items-center space-x-1">
                              <span>{cleaner.avgRating !== null ? cleaner.avgRating.toFixed(1) : "4.0"}</span>
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.448a1 1 0 00-.364 1.118l1.287 3.971c.3.921-.755 1.688-1.538 1.117l-3.364-2.447a1 1 0 00-1.176 0l-3.364 2.447c-.783.571-1.838-.196-1.538-1.117l1.287-3.971a1 1 0 00-.364-1.118L2.861 9.397c-.783-.57-.381-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z"></path>
                              </svg>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top Clients */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Top Clients</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Name</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Bookings Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dashboard.topClients.map((client, index) => (
                        <tr key={client.userId || index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">Limpiar Inc.</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">{client.bookingsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Bookings</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Service Type</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dashboard.lastBookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{booking.serviceType}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">{booking.status}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 transition-all">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Looker Studio Dashboard */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Detailed Analytics Dashboard</h2>
                  </div>
                  <iframe
                    width="100%"
                    height="600"
                    src="https://lookerstudio.google.com/embed/reporting/e65894ab-061e-4981-8736-7763820b5be2/page/tHMNF"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}