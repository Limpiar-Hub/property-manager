"use client"
import PropertyMetrics from "@/components/property-metrics/property-metrics"
import PropertyDetails from "@/components/property-metrics/property-details"
import PropertyBookings from "@/components/property-metrics/property-bookings"
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

// Update the main container to have better padding on mobile
export default function PropertyInfo({ id }: { id: string }) {
    const [propertyDetails, setPropertyDetails] = useState<any>([])
    const [propertyMetrics, setPropertyMetrics] = useState<any>([])
    const [propertyBookings, setPropertyBookings] = useState<any>([])
    const [propertyCount, setPropertyCount] = useState<number>(0)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const { user, token } = useAppSelector((state) => state.auth);

    let User: any
    if (token) {
        const decoded = jwtDecode(token);
        User = decoded;
    }

    useEffect(() => {
          const fetchData = async () => {
            try {
              const Details = await fetch(`https://limpiar-backend.onrender.com/api/properties/${id}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`, // Set the Bearer token
                }
              }); 
      
              const result = await Details.json();

      
              if (!Details.ok) {
                throw new Error(result.message || "Login failed")
              }
      
              setPropertyDetails(result.data);
            } catch (err:any) {
              setError(err.message);
            } finally {
              setIsLoading(false);
            }


            // try {
            //     const Metrics = await fetch(`https://limpiar-backend.onrender.com/api/users/67b46440ef5688b6d2418bd7`, {
            //       method: "GET",
            //       headers: {
            //         Authorization: `Bearer ${token}`, // Set the Bearer token
            //       }
            //     }); 
        
            //     const resulte = await Metrics.json();
            //     console.log(resulte)
        
            //     if (!Metrics.ok) {
            //       throw new Error(resulte.message || "Login failed")
            //     }
        
            //     setPropertyMetrics(resulte.data);
            //   } catch (err:any) {
            //     setError(err.message);
            //   } finally {
            //     setIsLoading(false);
            //   }


              try {
                const Bookings = await fetch(`https://limpiar-backend.onrender.com/api/bookings/history/67b46440ef5688b6d2418bd7`, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`, // Set the Bearer token
                  }
                }); 
        
                const results = await Bookings.json();

        
                if (!Bookings.ok) {
                  throw new Error(results.message || "Login failed")
                }
        
                setPropertyBookings(results.data);
              } catch (err:any) {
                setError(err.message);
              } finally {
                setIsLoading(false);
              }
          };
      
          fetchData();
        }, []);
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <PropertyMetrics bookings={propertyBookings}/>
      <PropertyDetails PropertyDetailsData={propertyDetails} />
      <PropertyBookings bookings={propertyBookings} />
    </div>
  )
}
