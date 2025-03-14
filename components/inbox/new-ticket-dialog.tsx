"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { addTicket } from "@/redux/features/tickets/ticketSlice"
import type { TicketCategory } from "@/redux/features/tickets/ticketSlice"

interface NewTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTicketDialog({ open, onOpenChange }: NewTicketDialogProps) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<TicketCategory>("Payment")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(
      addTicket({
        id: Math.random().toString(),
        title,
        description,
        category,
        status: "open",
        createdAt: new Date().toLocaleString(),
        userId: "1",
        userAvatar: "/placeholder.svg",
      }),
    )
    onOpenChange(false)
    setTitle("")
    setCategory("Payment")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Ticket Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Ticket Title"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="category">Category</label>
            <Select value={category} onValueChange={(value: TicketCategory) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="Bookings">Bookings</SelectItem>
                <SelectItem value="Property">Property</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Ticket Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter ticket description"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Ticket
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

