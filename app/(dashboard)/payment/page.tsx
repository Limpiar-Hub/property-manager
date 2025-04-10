"use client";

import { Plus, RefreshCcw, UserCheck, Wallet } from "lucide-react";
import { TransactionTable } from "@/components/payment/transaction-table";
import { useDispatch } from "react-redux";
import { openRefundModal } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { jwtDecode } from "jwt-decode";
import { setUserBalance } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { Loader2 } from "lucide-react";
// import { TopUpModal } from "@/components/payment/top-up-modal/top-up-modal"
import dynamic from "next/dynamic";
const TopUpModal = dynamic(
  () =>
    import("@/components/payment/top-up-modal/top-up-modal").then(
      (mod) => mod.TopUpModal
    ),
  {
    ssr: false,
  }
);

const RefundModal = dynamic(
  () =>
    import("@/components/payment/refund-modal/refund-modal").then(
      (mod) => mod.RefundModal
    ),
  {
    ssr: false,
  }
);

// const TopUpModal = dynamic(
//   () =>
//     import("@/components/payment/refundModal/top-up-modal").then(
//       (mod) => mod.TopUpModal
//     ),
//   {
//     ssr: false,
//   }
// );
import { openModal } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { promise } from "zod";
// import { openModal } from "@/redux/features/modalSlice/modalSlice";

export default function PaymentsPage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const dispatch = useDispatch();
  

  let userWallet: any;
    const getUserFromLocalStorage = localStorage.getItem("userWallet");
    if (getUserFromLocalStorage) {
      const user = JSON.parse(getUserFromLocalStorage)
      userWallet = user.data;
    }

    const { user, token } = useAppSelector((state) => state.auth);
        let User: any
        if (token) {
            const decoded = jwtDecode(token);
            User = decoded;
        }

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const GetWalletBalance = await fetch(`https://limpiar-backend.onrender.com/api/wallets/balances/${userWallet.wallet._id
          }`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Set the Bearer token
            }
          }); 
  
          const res = await GetWalletBalance.json();
          console.log(`Wallet balance ${res.wallet.balance}`);
  
          if (!GetWalletBalance.ok) {
            throw new Error(res.message || "Login failed")
          }
  
          setWalletBalance(res.wallet.balance);
          dispatch(setUserBalance(res.wallet.balance));
        } catch (err:any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

        fetchData();
    }, []);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [GetPaymentTransactions, GetWalletTransactions] = await  Promise.all([
          fetch(`https://limpiar-backend.onrender.com/api/payments/user/${User.userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Set the Bearer token
            }
          }), 

          fetch(`https://limpiar-backend.onrender.com/api/wallets/${userWallet.wallet._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Set the Bearer token
            }
          })
        ]);
        

        const res1 = await GetPaymentTransactions.json();
        const res2 = await GetWalletTransactions.json();

        if (!GetPaymentTransactions.ok) {
          throw new Error(res1.message || "Login failed")
        }
        if (!GetWalletTransactions.ok) {
          throw new Error(res2.message || "Login failed")
        }

        const Walletobj = await res2.wallet.transactions
        const WalletTransactions = Object.keys(Walletobj).flatMap((wallet: any) => {
          if (Walletobj[wallet].length === 0) return [];


         return Walletobj[wallet].map((txn: any) => {
            return {
              id: txn._id || txn.id,
              amount: txn.amount,
              currency: txn.currency || "USD",
              status: txn.status || "N/A",
              description: wallet === 'refunds' ? `Refund of ${txn.amount} from ${txn.from}` : txn.description || "No description provided", // Fallback description
              reference: txn.transactionId || "N/A",
              createdAt: txn.timestamp,
              // updatedAt: txn.updatedAt || txn.updated,
              method: "wallet",
            }
          })
        });

        const PaymentTransactions = res1.data.map((txn: any) => {
          return {
            id: txn._id || txn.id,
            amount: txn.amount,
            currency: txn.currency || "USD",
            status: txn.status || "N/A",
            description: txn.description || `Payment of ${txn.amount} ${txn.currency}`, // Fallback description
            reference: txn.paymentIntentId || txn.reference,
            createdAt: txn.createdAt || txn.created,
            // updatedAt: txn.updatedAt || txn.updated,
            method: "stripe",
          }
        });
        const combinedTransactions = [...WalletTransactions, ...PaymentTransactions].flat();

        combinedTransactions.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log(user)
        setTransactions(combinedTransactions);



        // setWalletBalance(res.wallet.balance);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      
    }

    useEffect(() => {
        fetchData();
    }, []);

  return (
    <div className="flex  bg-gray-50">
      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Payments</h1>
          <div className="flex flex-col items-center justify-center ">
            <div className="max-w-md w-full mx-auto">
              <div className="bg-[#2D82FF] rounded-lg p-6 text-white relative overflow-hidden shadow-lg">
                {/* Wave pattern background */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,100 C20,120 40,140 60,120 C80,100 100,80 120,100 C140,120 160,140 180,120 C200,100 220,80 240,100 C260,120 280,140 300,120 C320,100 340,80 360,100 C380,120 400,140 420,120"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,80 C20,100 40,120 60,100 C80,80 100,60 120,80 C140,100 160,120 180,100 C200,80 220,60 240,80 C260,100 280,120 300,100 C320,80 340,60 360,80 C380,100 400,120 420,100"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,60 C20,80 40,100 60,80 C80,60 100,40 120,60 C140,80 160,100 180,80 C200,60 220,40 240,60 C260,80 280,100 300,80 C320,60 340,40 360,60 C380,80 400,100 420,80"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,40 C20,60 40,80 60,60 C80,40 100,20 120,40 C140,60 160,80 180,60 C200,40 220,20 240,40 C260,60 280,80 300,60 C320,40 340,20 360,40 C380,60 400,80 420,60"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,20 C20,40 40,60 60,40 C80,20 100,0 120,20 C140,40 160,60 180,40 C200,20 220,0 240,20 C260,40 280,60 300,40 C320,20 340,0 360,20 C380,40 400,60 420,40"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                <div className="relative z-10 text-center">
                  <p className="text-lg mb-2">Wallet Balance</p>
                  <p className="text-4xl font-bold">${isLoading ? <span className="text-xl">Loading...</span>: walletBalance}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium w-full">
        <Plus className="w-4 h-4" />
        Top Up Wallet
      </button> */}
                <button
                  onClick={() => dispatch(openModal())}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Top Up Wallet
                </button>
                {/* <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium w-full"> */}
                <button
                  onClick={() => dispatch(openRefundModal())}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-sm font-medium"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Request Refund
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <TransactionTable transactions={transactions}/>
          </div>
        </div>
        <TopUpModal fetchTransactions={fetchData} />
        <RefundModal/>
      </main>
    </div>
  );
}
