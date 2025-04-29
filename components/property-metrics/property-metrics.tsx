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
  propertyManagerId: string;
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

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) {
        setError("Authentication required.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user to get walletId
        const userRes = await axios.get(
          `https://limpiar-backend.onrender.com/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const walletId = userRes.data.wallet?._id || userRes.data.walletId;
        if (!walletId) throw new Error("Wallet ID not found for user.");

        // Fetch properties
        const propertiesRes = await axios.get(
          `https://limpiar-backend.onrender.com/api/properties/fetch/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const properties = propertiesRes.data.data || [];
        if (properties.length === 0) {
          setError("No properties found for this user.");
          setBookings([]);
          setWallet(null);
          setProperty(null);
          return;
        }

        const selectedProperty = properties[0];
        setProperty(selectedProperty);

        // Fetch bookings
        const bookingsRes = await axios.get(
          `https://limpiar-backend.onrender.com/api/bookings/history/${selectedProperty.propertyManagerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { timeframe },
          }
        );
        const bookingsData = Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : bookingsRes.data.data || [];
        setBookings(bookingsData);

        // Fetch wallet data
        const walletRes = await axios.get(
          `https://limpiar-backend.onrender.com/api/wallets/${walletId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { timeframe },
          }
        );
        setWallet(walletRes.data.wallet || null);
      } catch (err: any) {
        console.error("Error:", err);
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

  const countActive = bookings.filter((b) =>
    b.status.toLowerCase().includes("confirm")
  ).length;
  const countPending = bookings.filter((b) =>
    b.status.toLowerCase().includes("pend")
  ).length;
  const countCancelled = bookings.filter((b) =>
    b.status.toLowerCase().includes("cancel")
  ).length;

  const allTransactions = wallet
    ? Object.values(wallet.transactions).flat()
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
          </div>
        </div>
      )}
    </div>
  );
}
