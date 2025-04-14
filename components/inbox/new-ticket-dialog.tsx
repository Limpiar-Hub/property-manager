
"use client";

import { useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTicketDialog({ open, onOpenChange }: NewTicketDialogProps) {
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.auth.user?._id);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const loading = useAppSelector((state: RootState) => state.tickets.loading);

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
