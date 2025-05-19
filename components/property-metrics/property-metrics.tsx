"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon, CopyIcon, BarChart4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useAppSelector } from "@/hooks/useReduxHooks";
import type { RootState } from "@/redux/store";

interface Booking {
  _id: string;
  status: string;
  propertyId: string;
}

interface Transaction {
  amount: number;
  status: "pending" | "completed" | "cancelled";
  transactionCategory: string;
}

interface WalletData {
  balance: number;
  transactions: {
    walletPayments: Transaction[];
    deposits: Transaction[];
    withdrawals: Transaction[];
    transfers: Transaction[];
    refunds: Transaction[];
  };
}

interface Property {
  _id: string;
  name: string;
}

export default function PropertyMetrics() {
  const [timeframe, setTimeframe] = useState("This Week");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userId = user?._id;
  const walletId = "67e1e8dff3f1e8b76ed8d219"; // Hardcoded walletId

  // Fetch data when component mounts or timeframe/userId/token changes
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Please log in to view metrics");
        console.log("No token available");
        return;
      }

      if (!userId) {
        setError("User not authenticated");
        console.log("No userId available", { user });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch properties by user ID
        console.log("Fetching properties for user:", userId);
        const propertiesResponse = await axios.get(
          `https://limpiar-backend.onrender.com/api/properties/fetch/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const properties = propertiesResponse.data.data || [];
        console.log("Properties response:", propertiesResponse.data);
        if (properties.length === 0) {
          setError("No properties found for this user");
          setBookings([]);
          setWallet(null);
          setProperty(null);
          setLoading(false);
          return;
        }

        // Use the first property
        const selectedProperty = properties[0];
        setProperty(selectedProperty);
        console.log("Selected property:", selectedProperty);

        // Fetch bookings
        console.log("Fetching bookings for property:", selectedProperty._id, "with timeframe:", timeframe);
        const bookingsResponse = await axios.get(
          `https://limpiar-backend.onrender.com/api/bookings/history/${selectedProperty._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { timeframe },
          }
        );
        const bookingsData = Array.isArray(bookingsResponse.data)
          ? bookingsResponse.data
          : bookingsResponse.data.data || [];
        setBookings(bookingsData);
        console.log("Bookings response:", bookingsResponse.data);
        console.log("Set bookings:", bookingsData);

        // Fetch wallet data
        console.log("Fetching wallet data for wallet:", walletId, "with timeframe:", timeframe);
        const walletResponse = await axios.get(
          `https://limpiar-backend.onrender.com/api/wallets/${walletId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { timeframe },
          }
        );
        setWallet(walletResponse.data.wallet || null);
        console.log("Wallet response:", walletResponse.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch data");
        setBookings([]);
        setWallet(null);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, timeframe]);

  // Count bookings by status
  const countActive = Array.isArray(bookings)
    ? bookings.filter((book) => book.status.toLowerCase().includes("confirm")).length
    : 0;
  const countPending = Array.isArray(bookings)
    ? bookings.filter((book) => book.status.toLowerCase().includes("pend")).length
    : 0;
  const countCancelled = Array.isArray(bookings)
    ? bookings.filter((book) => book.status.toLowerCase().includes("cancel")).length
    : 0;

  // Calculate payment metrics from transactions
  const allTransactions = wallet
    ? [
        ...(wallet.transactions.walletPayments || []),
        ...(wallet.transactions.deposits || []),
        ...(wallet.transactions.withdrawals || []),
        ...(wallet.transactions.transfers || []),
        ...(wallet.transactions.refunds || []),
      ]
    : [];
  const completedPayments = allTransactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const pendingPayments = allTransactions
    .filter((tx) => tx.status === "pending")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const cancelledPayments = allTransactions
    .filter((tx) => tx.status === "cancelled")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Property Metrics</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          Loading metrics...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32 text-red-500">
          {error}
        </div>
      ) : bookings.length === 0 && !wallet ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No bookings or wallet data for this property.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                <h3 className="text-2xl md:text-3xl font-bold">{bookings.length}</h3>
              </div>
              <Button variant="ghost" size="icon">
                <CopyIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
                <p className="text-lg md:text-xl font-semibold">{countActive}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Bookings</p>
                <p className="text-lg md:text-xl font-semibold">{countPending}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Cancelled Bookings</p>
                <p className="text-lg md:text-xl font-semibold">{countCancelled}</p>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="flex items-center text-green-500 mr-4">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">21.9%</span>
              </div>
              <div className="text-gray-400 text-sm">
                <span className="mr-1">+50</span>
                <span>This Week</span>
              </div>
            </div>
          </div>

          {/* Payments Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Payments</p>
                <h3 className="text-2xl md:text-3xl font-bold">
                  ${wallet?.balance?.toLocaleString() || "0"}
                </h3>
              </div>
              <Button variant="ghost" size="icon">
                <BarChart4Icon className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed Payments</p>
                <p className="text-lg md:text-xl font-semibold">
                  ${completedPayments.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
                <p className="text-lg md:text-xl font-semibold">
                  ${pendingPayments.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Cancelled Payments</p>
                <p className="text-lg md:text-xl font-semibold">
                  ${cancelledPayments.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="flex items-center text-green-500 mr-4">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">21.9%</span>
              </div>
              <div className="text-gray-400 text-sm">
                <span className="mr-1">+$60</span>
                <span>This Week</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}