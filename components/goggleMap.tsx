import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import SearchBox from "./mapSerchBox";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128, // New York City Latitude
  lng: -74.0060, // New York City Longitude
};

interface GoogleMapProps {
  apiKey: string;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ apiKey }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handlePlaceSelected = (location: { lat: number; lng: number }) => {
    setCenter(location);
    setMarkerPosition(location);  
  };

  return (
    <div className="relative w-full">
      <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SearchBox onPlaceSelected={handlePlaceSelected} />
          </div>

          <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              <Marker position={markerPosition} />
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
