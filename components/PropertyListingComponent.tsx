"use client";

import Image from "next/image";
import { Search, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";

interface PropertyListingComponentProps {
  propertyData: Property[];
  count: number;
}

export default function PropertyListingComponent({ propertyData, count }: PropertyListingComponentProps) {
  const router = useRouter();
  const [searches, setSearches] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending'>('all');

  const handleRouter = () => {
    router.push("/my-property/add");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearches(e.target.value);
  };

  const countActive = propertyData.filter((property: Property) => 
    property.status.toLowerCase() === 'verified'
  );
  
  const countPending = propertyData.filter((property: Property) => 
    property.status.toLowerCase() === 'pending'
  );

  const propertiesToDisplay = activeTab === 'all' ? propertyData :
                             activeTab === 'active' ? countActive :
                             countPending;

  const filteredProperties = propertiesToDisplay.filter((property: Property) =>
    property.name.toLowerCase().includes(searches.toLowerCase()) || 
    property.address.toLowerCase().includes(searches.toLowerCase()) || 
    property.status.toLowerCase().includes(searches.toLowerCase()) || 
    property.type.toLowerCase().includes(searches.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Container */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h1 className="text-3xl font-bold text-gray-900">
              My Properties
            </h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              {/* Search Container */}
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full sm:w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleSearch}
                  value={searches}
                />
              </div>
              {/* Add Button Container */}
              <button
                onClick={handleRouter}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Property</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Container */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
          <div className="flex space-x-2">
            <TabButton text={`All (${count})`} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
            <TabButton text={`Active (${countActive.length})`} active={activeTab === 'active'} onClick={() => setActiveTab('active')} />
            <TabButton text={`Pending (${countPending.length})`} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.length ? (
            filteredProperties.map((property: Property) => (
              <PropertyCard 
                key={property._id} 
                status={property.status} 
                src={property.images[1] ? `https://limpiar-backend.onrender.com/api/properties/gridfs/files/${property.images[1]}` : '/listing.png'} 
                location={property.address} 
                type={property.type} 
                name={property.name} 
                propertyId={property._id} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No properties found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  text: string;
  active?: boolean;
  onClick: () => void;
}

function TabButton({ text, active = false, onClick }: TabButtonProps) {
  return (
    <button
      className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-medium transition-colors duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

interface PropertyCardProps {
  status: string;
  src: string;
  location: string;
  type: string;
  name: string;
  propertyId: string;
}

function PropertyCard({ status, src, location, type, name, propertyId }: PropertyCardProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/my-property/${id}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transform hover:scale-105 transition-transform duration-200">
      <div className="relative">
        <Image 
          src={src}
          alt={name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          priority
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            status.toLowerCase() === "verified"
              ? "bg-blue-100 text-blue-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {status.toLowerCase() === "verified" ? "Active" : "Pending"}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="truncate">{location.split(" ").slice(0, 3).join(" ")}</span>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <span className="text-gray-600 text-sm truncate">{type}</span>
          <button 
            className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
            onClick={() => handleViewDetails(propertyId)}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}