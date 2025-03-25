"use client"

import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RootState } from "@/redux/store"
import { goBack } from "@/redux/features/topUpModalSlice/topUpModalSlice"

export function DebitCardStep() {
  const dispatch = useDispatch()
  const { amount } = useSelector((state: RootState) => state.topUpModal)

  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => dispatch(goBack())}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Top Up with Debit Card</h2>
      </div>

      <div className="text-center py-4">
        <p className="text-sm text-gray-500">Amount</p>
        <p className="text-2xl font-semibold">${amount}</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="card">Card Number</Label>
          <Input id="card" placeholder="XXXX XXXX XXXX" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiration Date</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvv">Security Code</Label>
            <Input id="cvv" placeholder="XXX" />
          </div>
        </div>
      </div>

      <Button className="w-full">Proceed to Pay</Button>
    </div>
  )
}

