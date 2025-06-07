"use client";
import { useEffect, useCallback } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import axios from "axios";


export default function AnalyticsPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const managerId = user?._id;

  // Push data to Google Sheets in the background
  const pushToSheets = useCallback(async () => {
    try {
      if (!token || !managerId) {
        console.warn("Token or managerId is missing");
        toast({
          title: "Error",
          description: "Authentication details are missing.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(
        `https://limpiar-backend.onrender.com/api/sheets/push-to-sheets/property_manager`,
        { managerId }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        console.log("Data successfully pushed to Google Sheets");
      } else {
        console.warn("Failed to push data to Google Sheets");
      }
    } catch (err) {
      console.error("Error pushing to sheets:", err);
    }
  }, [token, managerId]);

  // Trigger push on mount
  useEffect(() => {
    pushToSheets();
  }, [pushToSheets]);

  return (
    <div className="relative">
      <main className="pt-8 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>

          <div className="bg-white rounded-lg shadow">
            <iframe
              width="100%"
              height="600"
              src="https://lookerstudio.google.com/embed/reporting/e65894ab-061e-4981-8736-7763820b5be2/page/tHMNF"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      </main>
    </div>
  );
}