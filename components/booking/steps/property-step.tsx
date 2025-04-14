"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setProperty, setStep } from "@/redux/features/booking/bookingSlice";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PropertyStep() {
  const dispatch = useAppDispatch();
  const { property } = useAppSelector((state) => state.booking);
  const authState = useAppSelector((state) => state.auth);
  const user = authState.user || null;
  const token = authState.token;
  const currentUserId = user?._id || null;

  const [properties, setProperties] = useState<
    { _id: string; name: string; image?: string }[]
  >([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!token || !user) {
        console.error("User or token is missing");
        return;
      }

      try {
        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/properties/fetch/${currentUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching properties: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched properties:", data);

        // Map properties to include image URLs
        const mappedProperties = data.data.map((prop: any) => ({
          _id: prop._id,
          name: prop.name,
          image:
            prop.images && prop.images.length > 0
              ? `https://limpiar-backend.onrender.com/api/properties/gridfs/files/${prop.images[0]}`
              : "/placeholder.svg", // Use placeholder if no image is available
        }));

        setProperties(mappedProperties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, [token, user]);

  const handleBack = () => {
    dispatch(setStep(1));
  };

  const handleNext = () => {
    if (property) {
      dispatch(setStep(3));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select property</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {properties.map((prop) => (
      <div
      key={prop._id}
      onClick={() => {
        dispatch(
          setProperty({
            id: prop._id,
            name: prop.name,
            image: prop.image || "/placeholder.svg", 
          })
        );
        console.log("Selected property:", prop);
      }}
      className={`relative rounded-lg p-4 cursor-pointer border-2 transition-all
        ${
          property?.id === prop._id
            ? "border-blue-500"
            : "border-gray-200 hover:border-gray-400"
        }`}
    >
      <div className="relative w-full h-32 mb-2">
        <Image
          src={prop.image || "/placeholder.svg"}
          alt={prop.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h4 className="font-medium text-center">{prop.name}</h4>
      {property?.id === prop._id && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleNext}
          disabled={!property}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
