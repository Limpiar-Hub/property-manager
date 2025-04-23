"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyListingComponent from "@/components/PropertyListingComponent";
import Spinner from "@/components/spinner";
import { Property } from "@/types/property";

export default function PropertyListingPage() {
  const router = useRouter();
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

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

        const properties: Property[] = result.data || [];

        // Log the fetched properties to inspect them
        console.log("Fetched properties:", properties);

        // Set all properties
        setAllProperties(properties);

        // Filter and set active and pending properties
        setActiveProperties(properties.filter((prop) => prop.status === "verified"));
        setPendingProperties(properties.filter((prop) => prop.status === "pending"));

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

  return (
    <PropertyListingComponent
      activeProperties={activeProperties}
      pendingProperties={pendingProperties}
      allProperties={allProperties}
    />
  );
}
