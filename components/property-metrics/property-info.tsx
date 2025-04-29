"use client";
import PropertyMetrics from "@/components/property-metrics/property-metrics";
import PropertyDetails from "@/components/property-metrics/property-details";
import PropertyBookings from "@/components/property-metrics/property-bookings";
import { useAppSelector } from "@/hooks/useReduxHooks";
// import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";


interface Property {
  id: string;
  name: string;
  address: string;
  images: string[];
}

interface Booking {
  id: string;
  status: string;
  _id: string;
  serviceType: string;
  date: string;
  startTime: string;
}

// interface DecodedToken {
//   userId: string;
//   [key: string]: any;
// }

interface UserWallet {
  data: {
    wallet: string;
  };
}

export default function PropertyInfo({ id }: { id: string }) {
  const [propertyDetails, setPropertyDetails] = useState<Property | null>(null);
  const [propertyBookings, setPropertyBookings] = useState<Booking[]>([]);
  const { token } = useAppSelector((state) => state.auth);

  const [userWallet, setUserWallet] = useState<string | null>(null);

  useEffect(() => {
    const userWalletData = localStorage.getItem("userWallet");
    if (userWalletData) {
      const parsedData: UserWallet = JSON.parse(userWalletData);
      setUserWallet(parsedData.data.wallet);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch property details
        const detailsResponse = await fetch(
          `https://limpiar-backend.onrender.com/api/properties/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const detailsResult = await detailsResponse.json();
        console.log(userWallet);

        if (!detailsResponse.ok) {
          throw new Error(
            detailsResult.message || "Failed to fetch property details"
          );
        }

        setPropertyDetails(detailsResult.data);

        // Fetch property bookings
        const bookingsResponse = await fetch(
          `https://limpiar-backend.onrender.com/api/bookings/history/:propertyManagerId`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookingsResult = await bookingsResponse.json();

        if (!bookingsResponse.ok) {
          throw new Error(bookingsResult.message || "Failed to fetch bookings");
        }

        setPropertyBookings(bookingsResult.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id, token, userWallet]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      {propertyDetails && (
        <>
          <PropertyMetrics bookings={propertyBookings} />
          <PropertyDetails PropertyDetailsData={propertyDetails} />
          <PropertyBookings bookings={propertyBookings} />
        </>
      )}
    </div>
  );
}
