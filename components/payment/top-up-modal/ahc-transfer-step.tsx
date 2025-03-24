"use client";

import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Copy, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/redux/store";
import { goBack } from  "@/redux/features/topUpModalSlice/topUpModalSlice";

const bankDetails = [
  { label: "Account Holder", value: "Limpiar property Managers" },
  { label: "Account Number", value: "66306873" },
  { label: "IBAN", value: "GB81CLJ12345678999909" },
  { label: "Swift Code", value: "SDLJNIP1334" },
  { label: "Bank Name", value: "Super Bank Limited" },
];

export function AHCTransferStep() {
  const dispatch = useDispatch();
  const { amount } = useSelector((state: RootState) => state.topUpModal);

  return (
    <div className="grid gap-1 p-2 h-full">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => dispatch(goBack())}>
          <ArrowLeft className="h-3 w-3" />
        </Button>
        <h2 className="text-sm font-medium ml-1">Top Up with AHC Transfer</h2>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-gray-500">Amount</p>
        <p className="text-base font-semibold">${amount}</p>
      </div>

      <p className="text-[10px] text-gray-500">
        Transfer to the account details below
      </p>

      {bankDetails.map(({ label, value }) => (
        <div key={label} className="grid gap-0.5">
          <Label className="text-[10px] text-gray-500">{label}</Label>
          <div className="flex justify-between bg-gray-50 p-0.5 rounded">
            <span className="text-[10px]">{value}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <Copy className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      ))}

      <Label className="text-[10px]">Upload Receipt</Label>
      <div className="border-2 border-dashed rounded-lg p-2 text-center">
        <Upload className="h-5 w-5 text-gray-400 mx-auto" />
        <p className="text-[10px] text-gray-600">
          Drag & Drop or{" "}
          <button className="text-blue-500 underline">Choose File</button>
        </p>
      </div>

      <Button className="w-full text-xs py-1.5">Confirm Payment</Button>
    </div>
  );
}
