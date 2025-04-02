
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Property {
  _id: string;
  name: string;
  address: string;
  type: string;
  subType: string;
  size: string;
  status: string;
  images: string[];
}

interface BookingDetailsSidebarProps {
  property: Property | null;
  onClose: () => void;
}

export default function BookingDetailsSidebar({
  property,
  onClose,
}: BookingDetailsSidebarProps) {
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("property-sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!property) return null;

  return (
    <div
      id="property-sidebar"
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-x-0"
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{property.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1 text-sm text-gray-900">{property.address}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Property Type</h3>
            <p className="mt-1 text-sm text-gray-900">{property.type}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Sub Type</h3>
            <p className="mt-1 text-sm text-gray-900">{property.subType}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Size</h3>
            <p className="mt-1 text-sm text-gray-900">{property.size}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {property.status.toLowerCase()}
            </p>
          </div>

         
          {property.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Images</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-md h-24 flex items-center justify-center"
                  >
                    <span className="text-xs text-gray-500">
                      Image {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}