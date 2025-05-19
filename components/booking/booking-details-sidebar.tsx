"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking, TimelineEvent } from "@/types/booking";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { createChatThread, setSelectedChat, fetchAllThreads } from "@/redux/features/chat/chatSlice";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";

interface BookingDetailsSidebarProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsSidebar({
  booking,
  onClose,
}: BookingDetailsSidebarProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const chats = useAppSelector((state) => state.chat.chats || []);
  const token = useAppSelector((state) => state.auth.token);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("booking-sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSendMessage = async () => {
    try {
      if (!token) {
        console.error("Token is missing. Unable to create chat thread.");
        alert("Token is missing. Please log in again.");
        return;
      }
  
      const cleanerId = booking.cleanerId?._id;
      const propertyManagerId = currentUserId;
  
      if (!cleanerId || !propertyManagerId) {
        console.error("Cleaner ID or Property Manager ID is missing.");
        alert("Missing necessary IDs. Please try again.");
        return;
      }
  
      // Check for existing chat
      const existingChat = chats.find(
        (chat) =>
          chat.participants.includes(cleanerId) &&
          chat.participants.includes(propertyManagerId) &&
          chat.taskId === booking._id
      );
  
      if (existingChat) {
        console.log("Existing chat found:", existingChat);
        dispatch(
          setSelectedChat({
            chatId: existingChat.id,
            cleanerName: booking.cleanerId?.fullName || "Unknown Cleaner",
            cleanerAvatar: booking.cleanerId?.avatar || "",
          })
        );
        router.push("/property-manager/inbox");
        return;
      }
  
      console.log("Creating new chat thread...");
      const response = await dispatch(
        createChatThread({
          participantIds: [propertyManagerId, cleanerId],
          taskId: booking._id,
          token,
        })
      );
  
      const newChat = response.payload || null;
  
      if (newChat) {
        console.log("New chat created:", newChat);
  
        // Ensure chat has both participants initialized
        if (newChat.participants && newChat.participants.length === 2) {
          // Fetch all threads to update the chat list
          console.log("Fetching all threads after creating new chat...");
          const threadsResponse = await dispatch(fetchAllThreads({ userId: currentUserId, token }));
          console.log("Threads fetched:", threadsResponse.payload);
  
          // Set the selected chat
          dispatch(
            setSelectedChat({
              chatId: newChat._id,
              cleanerName: booking.cleanerId?.fullName || "Unknown Cleaner",
              cleanerAvatar: booking.cleanerId?.avatar || "",
            })
          );
  
          // Redirect to inbox
          console.log("Redirecting to /inbox");
          router.push("/property-manager/inbox");
        } else {
          console.error("Chat participants are not initialized correctly:", newChat);
          alert("The chat was created, but the participants are not correctly initialized.");
        }
      } else {
        console.error("Failed to create chat thread. Response:", response);
        alert("Failed to create chat thread. Please try again.");
      }
    } catch (error) {
      console.error("Error creating chat thread:", error);
      alert("An error occurred while creating the chat. Please try again.");
    }
  };

  const demoTimeline: TimelineEvent[] = [
    {
      date: new Date(booking.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date(booking.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      event: "Booking requested by",
      icon: (
        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
      person: {
        name: "Property Manager",
      },
    },
    {
      date: new Date(booking.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: booking.startTime,
      event: "Scheduled for",
      icon: (
        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
  ];

  if (booking.cleanerId) {
    demoTimeline.push({
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      event: "Assigned to cleaner",
      icon: (
        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
      person: {
        name: booking.cleanerId.fullName,
        avatar: booking.cleanerId.avatar,
      },
    });
  }

  return (
    <div
      id="booking-sidebar"
      className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-lg z-50 flex flex-col"
    >
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Booking Details
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3">
            Booking Information
          </h3>

          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Assigned Cleaner</p>
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                {booking.cleanerId?.avatar ? (
                  <Image
                    src={booking.cleanerId.avatar}
                    alt={booking.cleanerId.fullName}
                    className="h-full w-full object-cover"
                    width={24}
                    height={24}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                    {booking.cleanerId?.fullName.charAt(0) || "N"}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium">
                {booking.cleanerId?.fullName || "Not assigned"}
              </span>
            </div>

            {booking.status.toLowerCase() === "confirmed" && booking.cleanerId && (
              <Button
                className="mt-4 border bg-white text-black flex items-center gap-2"
                onClick={handleSendMessage}
              >
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Property</p>
            <p className="text-sm">{booking.propertyId.name}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-sm">{booking.propertyId.address}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Services</p>
            <div className="text-sm">
              {booking.serviceType.split(",").map((service, i) => (
                <span key={i} className="block py-1">
                  • {service.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm">${booking.price.toFixed(2)}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Booking Date</p>
            <p className="text-sm">
              {new Date(booking.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Booking Time</p>
            <p className="text-sm">{booking.startTime}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <div
              className={cn(
                "inline-block text-xs font-medium px-2 py-0.5 rounded-sm",
                booking.status.toLowerCase() === "pending" &&
                  "bg-amber-50 text-amber-600",
                booking.status.toLowerCase() === "completed" &&
                  "bg-green-50 text-green-600",
                booking.status.toLowerCase() === "cancelled" &&
                  "bg-red-50 text-red-600",
                !["pending", "completed", "cancelled"].includes(
                  booking.status.toLowerCase()
                ) && "bg-gray-50 text-gray-600"
              )}
            >
              {booking.status}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-1">Created At</p>
            <p className="text-xs text-gray-700">
              {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <h3 className="text-xs font-medium text-gray-500 mb-4">Timeline</h3>
          <div className="space-y-0">
            {demoTimeline.map((event, index) => (
              <div key={index} className="relative pb-5">
                <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                <div className="flex">
                  <div className="text-xs text-gray-500 w-16 flex-shrink-0">
                    {event.time}
                  </div>
                  <div className="flex-shrink-0 mr-2 relative">
                    {event.icon}
                    {index < demoTimeline.length - 1 && (
                      <div className="absolute top-5 left-2.5 w-0 h-[calc(100%+5px)] border-l border-dashed border-gray-200"></div>
                    )}
                  </div>
                  <div className="text-sm">
                    {event.event}
                    {event.person && (
                      <span className="inline-flex items-center">
                        <div className="h-5 w-5 rounded-full bg-gray-200 mx-1 overflow-hidden">
                          {event.person.avatar ? (
                            <Image
                              src={event.person.avatar}
                              alt={event.person.name}
                              className="h-full w-full object-cover"
                              width={20}
                              height={20}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                              {event.person.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span>{event.person.name}</span>
                      </span>
                    )}
                    {event.company && (
                      <span>
                        <span className="text-blue-600 ml-1">
                          {event.company}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}