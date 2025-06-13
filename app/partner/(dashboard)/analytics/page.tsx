"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Analytics } from "@vercel/analytics/react";

// Placeholder auth selector; replace with your actual auth logic
const selectUserId = (state) => state.auth.user?.id || "placeholder_userid";
const selectToken = (state) => state.auth.token;

// Updated interface with optional properties
interface DashboardData {
  bookingsTrend?: { _id: string; count: number }[];
  cancellationTrend?: { _id: string; count: number }[];
  uniqueCleaners?: number;
  avgBookingValue?: number;
  repeatClientCount?: number;
  totalRevenue?: number;
  cleaners?: {
    cleanerId: string;
    fullName: string;
    email: string;
    totalBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    avgBookingValue: number;
    cancellationRate: number;
    revenueShare: number;
    bookingDistribution: number;
    performanceScore: number;
  }[];
  avgBookingsPerCleaner?: number;
  avgRevenuePerCleaner?: number;
  avgCancellationRate?: number;
  bookingGrowthRate?: number;
  topCleaner?: { cleanerId: string; fullName: string; totalRevenue: number };
  cleanerUtilizationRate?: number;
  revenuePerBookingDay?: number;
  clientRetentionRate?: number;
  revenueTrend?: { _id: string; totalRevenue: number }[];
  avgBookingsPerDay?: number;
  peakBookingDay?: { date: string; count: number };
  clientBookingFrequency?: number;
  bookingStdDev?: number;
  revenueConcentration?: number;
  cleanerReliability?: number;
  bookingCompletionRate?: number;
}

interface AnalyticsData {
  dashboard?: DashboardData;
}

export default function AnalyticsPage() {
  const userId = useAppSelector(selectUserId);
  const token = useAppSelector(selectToken);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(
    async (isLiveUpdate = false) => {
      try {
        if (isLiveUpdate) {
          setIsRefreshing(true);
        } else {
          setIsInitialLoading(true);
        }

        if (!token || !userId) {
          console.warn("Token or userId is missing");
          toast({
            title: "Error",
            description: "Authentication details are missing.",
            variant: "destructive",
          });
          return;
        }

        const response = await axios.get(
          `https://limpiar-backend.onrender.com/api/analytics/business/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.dashboard) {
          setAnalytics({ dashboard: response.data.dashboard });
          setLastUpdated(Date.now());
        } else {
          console.warn("No valid analytics data received");
          if (!isLiveUpdate) {
            setAnalytics(null);
          }
          toast({
            title: "Error",
            description: "No analytics data available.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        if (!isLiveUpdate) {
          setAnalytics(null);
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
    },
    [token, userId]
  );

  // Push data to Google Sheets
  const pushToSheets = useCallback(async () => {
    try {
      if (!token || !userId) {
        console.warn("Token or userId is missing");
        return;
      }

      const response = await axios.post(
        `https://limpiar-backend.onrender.com/api/sheets/push-to-sheets/business`,
        { userId },
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
  }, [token, userId]);

  // Setup live refresh and initial fetch
  useEffect(() => {
    fetchAnalytics();
    pushToSheets();

    if (isLive) {
      intervalRef.current = setInterval(() => {
        fetchAnalytics(true);
      }, 30000);
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

  // Helper to check if dashboard data is empty or invalid
  const isDashboardEmpty = () => {
    return (
      !analytics?.dashboard ||
      Object.keys(analytics.dashboard).length === 0 ||
      !analytics.dashboard.totalRevenue // Example key to check for meaningful data
    );
  };

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

      {/* Vercel Analytics */}
      <Analytics />

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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    Business Analytics Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Real-time insights into your cleaning business operations
                  </p>
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
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isLive ? "Live" : "Paused"}
                </button>
              </div>
            </div>

            {isDashboardEmpty() ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No analytics data available. Please check your connection or try again later.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Overview Section */}
                <Card className="transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                      </svg>
                      <CardTitle>Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-blue-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H3m6-17v17m4-17v17"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            ${(analytics?.dashboard?.totalRevenue ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Booking Value</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            ${Math.round(analytics?.dashboard?.avgBookingValue ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-indigo-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Unique Cleaners</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            {analytics?.dashboard?.uniqueCleaners ?? 0}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-purple-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Repeat Clients</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            {analytics?.dashboard?.repeatClientCount ?? 0}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-yellow-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Bookings/Day</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            {(analytics?.dashboard?.avgBookingsPerDay ?? 0).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 ${
                          isRefreshing ? "animate-pulse-once" : ""
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-red-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Cancellation Rate</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all">
                            {((analytics?.dashboard?.avgCancellationRate ?? 0) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cleaner Performance */}
                <Card className="transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      <CardTitle>Cleaner Performance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(analytics?.dashboard?.cleaners ?? []).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Total Bookings</TableHead>
                            <TableHead>Booking Distribution</TableHead>
                            <TableHead>Performance Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics?.dashboard?.cleaners?.map((cleaner) => (
                            <TableRow
                              key={cleaner.cleanerId}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <TableCell>{cleaner.fullName}</TableCell>
                              <TableCell>{cleaner.email}</TableCell>
                              <TableCell>{cleaner.totalBookings}</TableCell>
                              <TableCell>{cleaner.bookingDistribution.toFixed(2)}%</TableCell>
                              <TableCell>{cleaner.performanceScore.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No cleaner performance data available.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Booking and Revenue Trends (Scrolling) */}
                <Card className="transition-all duration-300 hover:shadow-xl border-t-4 border-gradient-to-r from-indigo-500 to-purple-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        ></path>
                      </svg>
                      <CardTitle>Booking & Revenue Trends</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="scroll-container">
                        {(analytics?.dashboard?.bookingsTrend ?? []).length > 0 ? (
                          <div className="scroll-content">
                            {[...(analytics?.dashboard?.bookingsTrend ?? []), ...(analytics?.dashboard?.bookingsTrend ?? [])].map(
                              (trend, index) => (
                                <div
                                  key={`${trend._id}-${index}`}
                                  className="flex justify-between py-2 px-4 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700"
                                >
                                  <span>{trend._id}</span>
                                  <span>{trend.count} bookings</span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No booking trend data available.
                          </div>
                        )}
                      </div>
                      <div className="scroll-container">
                        {(analytics?.dashboard?.revenueTrend ?? []).length > 0 ? (
                          <div className="scroll-content">
                            {[...(analytics?.dashboard?.revenueTrend ?? []), ...(analytics?.dashboard?.revenueTrend ?? [])].map(
                              (trend, index) => (
                                <div
                                  key={`${trend._id}-${index}`}
                                  className="flex justify-between py-2 px-4 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700"
                                >
                                  <span>{trend._id}</span>
                                  <span>${trend.totalRevenue.toLocaleString()}</span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No revenue trend data available.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Cleaner */}
                <Card className="transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      <CardTitle>Top Cleaner</CardTitle> {/* Fixed title from "Inactive Cleaner" */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {analytics?.dashboard?.topCleaner ? (
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {analytics.dashboard.topCleaner.fullName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            ${(analytics.dashboard.topCleaner.totalRevenue ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        No top cleaner data available.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Looker Studio Dashboard */}
                <Card className="transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      <CardTitle>Detailed Analytics Dashboard</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <iframe
                      width="100%"
                      height="600"
                      src="https://lookerstudio.google.com/embed/reporting/1fe8aa80-bc83-4664-be8c-7cfc9b161347/page/2aoNF"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen
                      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}