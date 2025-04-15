"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  resolveTicket,
  createTicket,
  setSelectedTicket,
} from "@/redux/features/tickets/ticketSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

export function TicketDetail() {
  const [reply, setReply] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const selectedTicketId = useSelector(
    (state: RootState) => state.tickets.selectedTicketId
  );
  const ticket = useSelector((state: RootState) =>
    state.tickets.tickets.find((t) => t.id === selectedTicketId)
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleBack = () => {
    dispatch(setSelectedTicket(null));
  };

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {isMobile ? (
          <div className="text-center p-4">
            <p>No ticket selected</p>
            <Button onClick={handleBack} className="mt-4">
              Back to list
            </Button>
          </div>
        ) : (
          <p>Select a ticket to view details</p>
        )}
      </div>
    );
  }

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    try {
      await dispatch(
        createTicket({
          userId: ticket.userId,
          messageText: reply,
          token: token || "",
        })
      ).unwrap(); // Use `.unwrap()` to handle the result properly
      setReply("");
    } catch (error) {
      console.error("Error sending ticket reply:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isMobile && (
        <div className="p-4 border-b bg-white flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Ticket Details</h2>
        </div>
      )}

      <div className="p-6 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{ticket.title}</h2>
          {ticket.status === "open" && (
            <Button
              variant="outline"
              onClick={() => dispatch(resolveTicket(ticket.id))}
            >
              Resolve Ticket
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Ticket Created {new Date(ticket.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUserId
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <Image
              src="/placeholder.svg"
              width={40}
              height={40}
              alt="Your avatar"
              className="rounded-full"
            />
          </Avatar>
          <div className="flex-1">
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full"
              onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
            />
          </div>
          <Button onClick={handleSendReply}>Send</Button>
        </div>
      </div>
    </div>
  );
}