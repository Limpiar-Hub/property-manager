"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setAmount, setReason } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { closeRefundModal } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { useState } from "react";
import { requestRefund } from "@/components/handlers";
import { useAppSelector } from "@/hooks/useReduxHooks";

export function RefundModal() {
  const [transactionAmount, setTransactionAmount] = useState<string>('0');
  const [text, setText] = useState<string>('');
  const [refundMessage, setRefundMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useDispatch();
  const { isOpen, isRefundModalOpen, reason, amount, userBalance } = useSelector(
    (state: RootState) => state.topUpModal
  );

    let userWallet: any;
    const getUserFromLocalStorage = localStorage.getItem("userWallet");
    if (getUserFromLocalStorage) {
      const user = JSON.parse(getUserFromLocalStorage)
      userWallet = user.data;
    }
    const id = userWallet.user.userId


  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeRefundModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  const handleChange = (event:any) => {
    setText(event.target.value);
    dispatch(setReason(text));
  };

  const handleAmount = (e:any) => {
    setTransactionAmount(e.target.value);
    dispatch(setAmount(Number(e.target.value)))
  }

  const handleProceed =  async () => {
    const body = {
        userId: id,
        amount: amount,
        reason: reason
      }
    const {data, error} = await requestRefund({body});
    if (data) setRefundMessage(data);
    if (error) setErrorMessage(error);

    dispatch(closeRefundModal())
  }

  return (
    <Dialog open={isRefundModalOpen} onOpenChange={() => dispatch(closeRefundModal())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Top-Up Modal</DialogTitle>
        </DialogHeader>
        <button
          onClick={() => dispatch(closeRefundModal())}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid gap-4 py-4">
      <div className="relative bottom-5 flex justify-center align-middle space-y-2 border-b-2">
        <h2 className="relative bottom-3 text-lg font-semibold">Request a Refund</h2>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Enter Amount</Label>
        <Input
          id="amount"
          placeholder="Payment"
          type="number"
          value={transactionAmount}
          onChange={handleAmount}
        />
        <div className="flex justify-between">
        <span className="text-sm text-gray-500">Available Balance</span>
        <span className="text-sm text-gray-500"> ${userBalance}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Reason for refund</Label>
        <textarea
        value={text}
        onChange={handleChange}
        placeholder="Description"
        className="bg-gray-200 h-24 rounded-md pl-3"
      />
      </div>

      <Button
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={handleProceed}
        disabled={!amount || !reason}
      >
        Confirm request refund
      </Button>
    </div>
      </DialogContent>
    </Dialog>
  );
}
