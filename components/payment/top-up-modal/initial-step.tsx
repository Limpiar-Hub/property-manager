"use client";

import { useDispatch, useSelector, } from "react-redux";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/redux/store";
import {
  setAmount,
  setPaymentMethod,
  setStep,
} from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { constants } from "buffer";
import { useState } from "react";

export function InitialStep({ fetchTransactions }: { fetchTransactions: () => void }) {
  const dispatch = useDispatch();
  const { amount, paymentMethod, userBalance } = useSelector(
    (state: RootState) => state.topUpModal
  );
  const [transactionAmount, setTransactionAmount] = useState<string>('0');
  const { user, token } = useAppSelector((state) => state.auth);
  const email = user?.email;
  const id = user?._id;
  const currency = 'usd'
  

  const handleProceed = async () => {
    // console.log(email, id, currency, amount);
      const body = {
        userId: id,
        email: email,
        amount: amount,
        currency: "usd"
      }
      try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/payments/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Set the Bearer token
          },
          body: JSON.stringify(body),
        })
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Unable to process payment at the moment")
        }

        if (data.success === true) {
          
          window.location.href = data.checkoutUrl          
          // Store token in Redux
          // dispatch(loginSuccess({ token: data.token }))
          
          // Redirect to OTP verification page
          // router.push("/verify-otp")
        } else {
          throw new Error("Unexpected response from server")
        }
        
        fetchTransactions();
      } catch (err) {
        // setError(err instanceof Error ? err.message : "An error occurred")
        console.log(err)
        // dispatch(loginStart())
      } finally {
        // setIsLoading(false)
        console.log('finished');
      }
    // } else if (paymentMethod === "ahc") {
    //   dispatch(setStep("ahcTransfer"));
    // }
  };

  const handleChange = (e:any) => {
    setTransactionAmount(e.target.value);
    dispatch(setAmount(Number(e.target.value)))
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Top Wallet</h2>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Enter Amount</Label>
        <Input
          id="amount"
          placeholder="Enter amount"
          type="number"
          value={transactionAmount}
          onChange={handleChange}
        />
        <p className="text-sm text-gray-500">Available Balance: ${userBalance}</p>
      </div>

      <div className="grid gap-2">
        <Label>Choose your payment option:</Label>
        <RadioGroup
          value={paymentMethod || ""}
          onValueChange={(value: "debit" | "ahc") =>
            dispatch(setPaymentMethod(value))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit">Debit / Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ahc" id="ahc" />
            <Label htmlFor="ahc">A/C Transfer</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={handleProceed}
        disabled={!amount || !paymentMethod}
      >
        Proceed to Pay
      </Button>
    </div>
  );
}
