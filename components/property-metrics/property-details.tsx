"use client";

import Image from "next/image";
import { MapPinIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { useState } from "react";

// Define the type for PropertyDetailsData
export type PropertyDetailsData = {
  name: string;
  address: string;
  images: string[];
};

interface PropertyDetailsProps {
  PropertyDetailsData: PropertyDetailsData;
}

export default function PropertyDetails({
  PropertyDetailsData,
}: PropertyDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    const firstInitial = names[0]?.[0] || "";
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const imageId1 = PropertyDetailsData?.images?.[0];
  const imageId2 = PropertyDetailsData?.images?.[1];
  const imageId3 = PropertyDetailsData?.images?.[2];

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
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )}

              {imageId1 && (
                <Image
                  src={`https://limpiar-backend.onrender.com/api/properties/gridfs/files/${imageId1}`}
                  alt="Property"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                  }}
                  className={`object-cover transition-opacity duration-500 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg">
                {isLoading && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  </div>
                )}

                {imageId2 && (
                  <Image
                    src={`https://limpiar-backend.onrender.com/api/properties/gridfs/files/${imageId2}`}
                    alt="Property"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    className={`object-cover transition-opacity duration-500 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}
              </div>
              <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg group cursor-pointer">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 text-white text-sm font-medium">
                  Show all photos
                </div>
                {isLoading && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  </div>
                )}

                {imageId3 && (
                  <Image
                    src={`https://limpiar-backend.onrender.com/api/properties/gridfs/files/${imageId3}`}
                    alt="Property"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    className={`object-cover transition-opacity duration-500 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-2">
              {PropertyDetailsData.name}
            </h3>
            <div className="flex items-center text-gray-500 mb-6">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{PropertyDetailsData.address}</span>
            </div>

            <div className="flex items-center relative top-24">
              <Avatar className="h-12 w-12 mr-4 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Darren Smith" />
                <AvatarFallback>
                  {user?.fullName ? getInitials(user.fullName) : "NA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-sm text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}