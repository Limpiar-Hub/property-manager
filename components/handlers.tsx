let userWallet: any;
  const getUserFromLocalStorage = localStorage.getItem("userWallet");
  if (getUserFromLocalStorage) {
    const user = JSON.parse(getUserFromLocalStorage)
    userWallet = user.data;
  }

export const AddNewProperty = async (formData: any, token: string) => {
    let result = {
        data: null,
        error: null
    }
    try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/properties", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userWallet.token}`, // Set the Bearer token
          },
          body: formData,
        });

        const data = await response.json();
        result.data = data
  
        if (!response.ok) {
          throw new Error(data.message || "Unable to add Property");
        }

    } catch (err: any) {
        console.log(err);
        result.error = err
    } finally {
        return result
    }
}

// PAYMENT MODULE HANDLERS
export const fetchUserBalanceData = async () => {
  try {
    const GetWalletBalance = await fetch(`https://limpiar-backend.onrender.com/api/wallets/balances/${userWallet.wallet._id
    }`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userWallet.token}`
      }
    }); 

    const res = await GetWalletBalance.json();

    if (!GetWalletBalance.ok) {
      throw new Error(res.message || "Login failed")
    }

    return {data: res.wallet.balance, err: null}
  } catch (err:any) {
    return {data: null, err: err.message}
  }
}

export const fetchTransactionData = async () => {
  try {
    const [GetPaymentTransactions, GetWalletTransactions] = await  Promise.all([
      fetch(`https://limpiar-backend.onrender.com/api/payments/user/${userWallet.user.userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userWallet.token}`
        }
      }), 

      fetch(`https://limpiar-backend.onrender.com/api/wallets/${userWallet.wallet._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userWallet.token}`
        }
      })
    ]);
    

    const res1 = await GetPaymentTransactions.json();
    const res2 = await GetWalletTransactions.json();

    if (!GetPaymentTransactions.ok) {
      throw new Error(res1.message || "Unable to get Transaction History")
    }
    if (!GetWalletTransactions.ok) {
      throw new Error(res2.message || "Unable to get Transaction History")
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
        method: "stripe",
      }
    });

    const combinedTransactions = [...WalletTransactions, ...PaymentTransactions].flat();
    combinedTransactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {data:combinedTransactions, err: null}
  } catch (err:any) {
    return {data: null, err: err.message}
  }
}

export const createPayment = async ({body}: {body: {userId: string | undefined, amount: number, email: string | undefined, currency: string}} ) => {
  try {
    const response = await fetch("https://limpiar-backend.onrender.com/api/payments/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userWallet.token}`, // Set the Bearer token
      },
      body: JSON.stringify(body),
    })

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to process payment at the moment")
    }

    return {data: data, error: null}
  } catch (err: any) {
    console.log(err)
    return {data: null, error: err.message}
  } 
} 

export const verifyStripePayment = async ({session_id}: {session_id: string}) => {
  try {
    const res = await fetch(`https://limpiar-backend.onrender.com/api/payments/success/${session_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userWallet.token}`
        },
      });;

    if (!res.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await res.json();
    return {data: data, error: null}
  } catch (err: any) {
    return {data: null, error: err.message}
  }
}

export const requestRefund = async ({body}: {body: {userId: string | undefined, amount: number, reason: string}} ) => {
  try {
    const response = await fetch("https://limpiar-backend.onrender.com/api/wallets/request-refund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userWallet.token}`
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json(); 
    
    if (!response.ok) {
      throw new Error(data.message || "Unable to process request at the moment");
    }

    console.log(data.message)
    return {data: data.message, error: null}
  } catch (err: any) {
    return {data: null, error: err.message}
  }
}