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
import { closeModal } from "@/redux/features/topUpModalSlice/topUpModalSlice";
import { InitialStep } from "./initial-step";
import { DebitCardStep } from "./debit-card-step";
import { AHCTransferStep } from "./ahc-transfer-step";

export function TopUpModal({ fetchTransactions }: { fetchTransactions: () => void }) {
  const dispatch = useDispatch();
  const { isOpen, currentStep } = useSelector(
    (state: RootState) => state.topUpModal
  );

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeModal());
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Top-Up Modal</DialogTitle>
        </DialogHeader>
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {currentStep === "initial" && <InitialStep fetchTransactions={fetchTransactions}/>}
        {currentStep === "debitCard" && <DebitCardStep />}
        {currentStep === "ahcTransfer" && <AHCTransferStep />}
      </DialogContent>
    </Dialog>
  );
}
