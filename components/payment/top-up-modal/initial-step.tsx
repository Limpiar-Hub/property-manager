"use client";

import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPayment } from "@/components/handlers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/redux/store";
import { setAmount, setPaymentMethod } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { useState } from "react";

export function InitialStep({ fetchTransactions }: { fetchTransactions: () => void }) {
  const dispatch = useDispatch();
  const { amount, paymentMethod, userBalance } = useSelector(
    (state: RootState) => state.topUpModal
  );
  const [transactionAmount, setTransactionAmount] = useState<string>("0");
  const { user } = useAppSelector((state) => state.auth);
  const email = user?.email;
  const id = user?._id;

  const handleProceed = async () => {
    const body = {
      userId: id,
      email: email,
      amount: amount,
      currency: "usd",
    };

    const { data } = await createPayment({ body }) as { data: { success: boolean; checkoutUrl: string; message: string } };
    if (data.success === true) {
      window.location.href = data.checkoutUrl;
    } else {
      console.error(data.message);
    }

    fetchTransactions();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTransactionAmount(value);
    dispatch(setAmount(Number(value)));
  };

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
          <div
            className="flex items-center space-x-2 opacity-50 pointer-events-none"
            aria-disabled="true"
          >
            <RadioGroupItem value="ahc" id="ahc" disabled />
            <Label htmlFor="ahc">A/C Transfer</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        className="w-full bg-[#4C41C0] hover:bg-blue-600"
        onClick={handleProceed}
        disabled={!amount || !paymentMethod}
      >
        Proceed to Pay
      </Button>
    </div>
  );
}