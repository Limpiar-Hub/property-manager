// }

"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "@/redux/features/tickets/ticketSlice";
import type { RootState } from "@/redux/store";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTicketDialog({ open, onOpenChange }: NewTicketDialogProps) {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const token = useSelector((state: RootState) => state.auth.token);
  const loading = useSelector((state: RootState) => state.tickets.loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!userId || !token) {
      alert("User is not authenticated.");
      return;
    }

    try {
      const response = await dispatch(
        createTicket({
          userId,
          messageText: description,
          token,
        }) as any
      );

      if (response.payload) {
        alert("Support ticket created successfully.");
        setDescription("");
        onOpenChange(false); // Close the dialog
      } else {
        alert("Failed to create support ticket.");
      }
    } catch (error) {
      console.error("Error creating support ticket:", error);
      alert("Failed to create support ticket.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
