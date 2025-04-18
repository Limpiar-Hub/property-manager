'use client';

interface UserWallet {
  token: string;
  wallet: {
    _id: string;
    transactions: Record<string, WalletTransaction[]>;
  };
  user: {
    userId: string;
  };
  data?: string;
}

interface WalletTransaction {
  _id?: string;
  id?: string;
  amount: number;
  currency?: string;
  status?: string;
  description?: string;
  transactionId?: string;
  timestamp: string;
  from?: string;
}

interface PaymentTransaction {
  _id?: string;
  id?: string;
  amount: number;
  currency?: string;
  status?: string;
  description?: string;
  paymentIntentId?: string;
  reference?: string;
  createdAt: string;
  created?: string;
}

interface StandardizedTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
  method: string;
}

interface RequestResult<T> {
  data: T | null;
  error: string | null;
}

const getUserWallet = (): UserWallet | null => {
  if (typeof window === 'undefined') return null;

  try {
    const getUserFromLocalStorage = localStorage.getItem("userWallet");
    if (!getUserFromLocalStorage) return null;

    const user = JSON.parse(getUserFromLocalStorage);
    return user?.data || null;
  } catch (err) {
    console.error("Failed to read userWallet from localStorage", err);
    return null;
  }
};

export const AddNewProperty = async (
  formData: FormData
): Promise<RequestResult<unknown>> => {
  const userWallet = getUserWallet();
  const result: RequestResult<unknown> = { data: null, error: null };

  if (!userWallet) {
    result.error = "User not authenticated";
    return result;
  }

  try {
    const response = await fetch(
      "https://limpiar-backend.onrender.com/api/properties",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userWallet.token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    result.data = data;

    if (!response.ok) {
      throw new Error(data.message || "Unable to add Property");
    }
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }

  return result;
};

export const fetchUserBalanceData = async (): Promise<
  RequestResult<number>
> => {
  const userWallet = getUserWallet();
  if (!userWallet) return { data: null, error: "User not authenticated" };

  try {
    const GetWalletBalance = await fetch(
      `https://limpiar-backend.onrender.com/api/wallets/balances/${userWallet.wallet._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userWallet.token}`,
        },
      }
    );

    const res = await GetWalletBalance.json();
    if (!GetWalletBalance.ok) throw new Error(res.message || "Login failed");

    return { data: res.wallet.balance, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};

export const fetchTransactionData = async (): Promise<
  RequestResult<StandardizedTransaction[]>
> => {
  const userWallet = getUserWallet();
  if (!userWallet) return { data: null, error: "User not authenticated" };

  try {
    // Fetch both endpoints in parallel
    const [paymentRes, walletRes] = await Promise.all([
      fetch(
        `https://limpiar-backend.onrender.com/api/payments/user/${userWallet.user.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userWallet.token}`,
          },
        }
      ),
      fetch(
        `https://limpiar-backend.onrender.com/api/wallets/${userWallet.wallet._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userWallet.token}`,
          },
        }
      ),
    ]);

    // Check responses before parsing JSON
    if (!paymentRes.ok) {
      const errorData = await safeParseJSON(paymentRes);
      throw new Error(errorData?.message || "Unable to get Payment Transactions");
    }
    if (!walletRes.ok) {
      const errorData = await safeParseJSON(walletRes);
      throw new Error(errorData?.message || "Unable to get Wallet Transactions");
    }

    // Safely parse JSON
    const paymentData = await paymentRes.json();
    const walletData = await walletRes.json();

    // Map wallet transactions
    const walletTransactions: StandardizedTransaction[] = Object.keys(walletData.wallet.transactions || {})
      .flatMap((walletType: string) => {
        const transactions = walletData.wallet.transactions[walletType];
        if (!transactions || transactions.length === 0) return [];

        return transactions.map((txn: WalletTransaction) => formatWalletTransaction(txn, walletType));
      });

    // Map payment transactions
    const paymentTransactions: StandardizedTransaction[] = (paymentData.data || []).map(
      (txn: PaymentTransaction) => formatPaymentTransaction(txn)
    );

    // Combine and sort by latest first
    const combinedTransactions = [...walletTransactions, ...paymentTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { data: combinedTransactions, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};

// Helper: safely parse JSON (returns null if invalid)
const safeParseJSON = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

// Helper: format wallet transaction
const formatWalletTransaction = (txn: WalletTransaction, walletType: string): StandardizedTransaction => ({
  id: txn._id || txn.id || "unknown",
  amount: txn.amount ?? 0,
  currency: txn.currency || "USD",
  status: txn.status || "N/A",
  description:
    walletType === "refunds" && txn.from
      ? `Refund of ${txn.amount} from ${txn.from}`
      : txn.description || "No description provided",
  reference: txn.transactionId || "N/A",
  createdAt: txn.timestamp || new Date().toISOString(),
  method: "wallet",
});

// Helper: format payment transaction
const formatPaymentTransaction = (txn: PaymentTransaction): StandardizedTransaction => ({
  id: txn._id || txn.id || "unknown",
  amount: txn.amount ?? 0,
  currency: txn.currency || "USD",
  status: txn.status || "N/A",
  description: txn.description || `Payment of ${txn.amount} ${txn.currency || "USD"}`,
  reference: txn.paymentIntentId || txn.reference || "N/A",
  createdAt: txn.createdAt || txn.created || new Date().toISOString(),
  method: "stripe",
});


interface PaymentBody {
  userId?: string;
  amount: number;
  email?: string;
  currency: string;
}

export const createPayment = async ({
  body,
}: {
  body: PaymentBody;
}): Promise<RequestResult<unknown>> => {
  const userWallet = getUserWallet();
  if (!userWallet) return { data: null, error: "User not authenticated" };

  try {
    const response = await fetch(
      "https://limpiar-backend.onrender.com/api/payments/create-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userWallet.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to process payment");

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};

export const verifyStripePayment = async ({
  session_id,
}: {
  session_id: string;
}): Promise<RequestResult<unknown>> => {
  const userWallet = getUserWallet();
  if (!userWallet) return { data: null, error: "User not authenticated" };

  try {
    const res = await fetch(
      `https://limpiar-backend.onrender.com/api/payments/success/${session_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userWallet.token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to verify payment");

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};

interface RefundBody {
  userId?: string;
  amount: number;
  reason: string;
}

export const requestRefund = async ({
  body,
}: {
  body: RefundBody;
}): Promise<RequestResult<string>> => {
  const userWallet = getUserWallet();
  if (!userWallet) return { data: null, error: "User not authenticated" };

  try {
    const response = await fetch(
      "https://limpiar-backend.onrender.com/api/wallets/request-refund",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userWallet.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Unable to process request");

    return { data: data.message, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};
