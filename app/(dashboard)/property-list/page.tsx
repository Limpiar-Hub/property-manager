

"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyListingComponent from "@/components/PropertyListingComponent";
import Spinner from "@/components/spinner";
import { Property } from "@/types/property";

export default function PropertyListingPage() {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch properties data - replace with your actual fetch logic
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get token from localStorage or elsewhere
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }
        
        // Get userId from token or elsewhere
        // This is just a placeholder - use your actual logic
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;
        
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
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [router]);

  if (isLoading) {
    return <Spinner />;
  }

  return <PropertyListingComponent propertyData={propertyData} count={propertyCount} />;
}
