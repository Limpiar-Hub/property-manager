"use client";

import GoogleMapComponent from "../goggleMap";

export default function LocationForm() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">
        Where is your property located?
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Search your address or find it on the map.
      </p>

      <div className="relative">
        <GoogleMapComponent
          apiKey={process.env.NEXT_PUBLIC_API_KEY || ""}
        />
      </div>
    </div>
  );
}