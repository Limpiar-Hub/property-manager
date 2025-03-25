"use client";

// import { useState } from "react";
import Image from "next/image";
import { MapPinIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PropertyDetails() {
  // const [showAllPhotos, setShowAllPhotos] = useState(false);

  const propertyDetails = [
    { label: "Floors", value: 10 },
    { label: "Units", value: 30 },
    { label: "Offices Rooms", value: 50 },
    { label: "Meeting Rooms", value: 10 },
    { label: "Lobbies", value: 20 },
    { label: "Restrooms", value: 40 },
    { label: "Break Rooms", value: 3 },
    { label: "Cafeteria", value: 2 },
    { label: "Gym", value: 1 },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Property Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-red-500">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
          {/* Image Gallery Section */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src="/cleaner.png"
                alt="Azure Haven main image"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src="/cleaner.png"
                  alt="Property thumbnail 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg group cursor-pointer">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 text-white text-sm font-medium">
                  Show all photos
                </div>
                <Image
                  src="/cleaner.png"
                  alt="Property thumbnail 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Azure Haven</h3>
            <div className="flex items-center text-gray-500 mb-6">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">Queens Center NY, USA</span>
            </div>

            <div className="flex items-center mb-6">
              <Avatar className="h-12 w-12 mr-4 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Darren Smith" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Darren Smith</p>
                <p className="text-sm text-gray-500">Property Manager</p>
              </div>
            </div>

            <div className="mt-auto">
              <h4 className="text-lg font-semibold mb-4">Property Detail</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                {propertyDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between pr-4">
                    <span className="text-gray-600">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
