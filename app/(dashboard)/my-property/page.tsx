"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { resetProperty } from "@/redux/features/addProperty/propertySlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropertyListingComponent from "@/components/PropertyListingComponent";
import Spinner from "@/components/spinner";
import { Property } from "@/types/property";

// New Icons
import { Home, Tag, MapPin, Image as ImageIcon } from "lucide-react";

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}


export default function MyPropertyPage() { 
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { user, token } = useAppSelector((state) => state.auth);

  const decodedToken: DecodedToken | null = token
    ? jwtDecode<DecodedToken>(token)
    : null;
  const userId = decodedToken?.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) return;

      try {
        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/properties/fetch/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch properties");
        }

        setPropertyData(result.data);
        setPropertyCount(result.count);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleAddProperty = () => {
    dispatch(resetProperty());
    router.push("/my-property/add");
  };

  // Steps data with Icons
  const steps = [
    {
      title: "Category",
      description: "Basic info like property category and sub-category.",
      icon: Home,
    },
    {
      title: "Title",
      description: "Give your property a name.",
      icon: Tag,
    },
    {
      title: "Location",
      description: "Add the location of your property.",
      icon: MapPin,
    },
    {
      title: "Image",
      description: "Add photos of your property.",
      icon: ImageIcon,
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : propertyData.length ? (
        <PropertyListingComponent propertyData={propertyData} count={propertyCount} />
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Welcome Banner */}
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-800 to-blue-600 mb-12">
            <div className="flex flex-col md:flex-row justify-between p-6 md:p-8">
              <div className="space-y-3 md:space-y-4 md:max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome, {user?.fullName || "Guest"}!
                </h1>
                <p className="text-blue-100 text-base md:text-lg">
                  Let&apos;s go ahead and add your first property to get you started.
                </p>
                <button
                  onClick={handleAddProperty}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors mt-2"
                >
                  Add property
                </button>
              </div>
              <div className="hidden md:block relative w-64 h-48">
                <Image
                  src="/duplex.png"
                  alt="Apartment building"
                  width={300}
                  height={400}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              Add your property in a few simple steps
            </h2>

            <div className="space-y-6 md:space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                      <step.icon size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {step.description}
                    </p>
                    <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
