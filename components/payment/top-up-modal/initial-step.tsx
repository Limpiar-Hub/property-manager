"use client";

import { useDispatch, useSelector } from "react-redux";
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

export function InitialStep() {
  const dispatch = useDispatch();
  const { amount, paymentMethod } = useSelector(
    (state: RootState) => state.topUpModal
  );

  const handleProceed = () => {
    if (paymentMethod === "debit") {
      dispatch(setStep("debitCard"));
    } else if (paymentMethod === "ahc") {
      dispatch(setStep("ahcTransfer"));
    }
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
          value={amount}
          onChange={(e) => dispatch(setAmount(e.target.value))}
        />
        <p className="text-sm text-gray-500">Available Balance: $1000.00</p>
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
