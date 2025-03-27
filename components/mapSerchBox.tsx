import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useAppDispatch } from "@/hooks/useReduxHooks"
import { setLocation } from "@/redux/features/addProperty/propertySlice"
import { MapPin } from "lucide-react"

interface SearchBoxProps {
  onPlaceSelected: (location: { lat: number; lng: number }) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onPlaceSelected }) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dispatch = useAppDispatch()

  const onPlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      place.geometry?.viewport
      if (place?.geometry?.location  && place.address_components) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        const address = place.address_components?.map(ads => ads.long_name).join(", ")
        dispatch(
              setLocation({
                address,
                coordinates: newLocation
              }),
        )

        onPlaceSelected(newLocation); // Send location to parent (GoogleMapComponent)
      } else {
        console.warn("No valid location found for the selected place.");
      }
    }
  };


  return (
    <Autocomplete onLoad={(ref) => (autoCompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
        <div>
        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
            type="text"
            placeholder="Search location"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
    </Autocomplete>
  );
};

export default SearchBox;
