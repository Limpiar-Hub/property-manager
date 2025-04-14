// "use client"

// import Image from "next/image";
// import { Search, Plus, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks" 
// import { useRouter } from "next/navigation";

// interface Property {
//   id: string;
//   status: string;
//   address: string;
//   type: string;
//   name: string;
// }

// export default function PropertyListing({ propertyData, count }: any) {
//   const router = useRouter();
//   const [searches, setSearches] = useState<string>('');

//   const handleRouter = () => {
//     router.push("/my-property/add")
//   }

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearches(e.target.value);
//   }

//   const filteredProperties = propertyData.filter((property: any) =>
//     property.name.toLowerCase().includes(searches.toLowerCase()) || property.address.toLowerCase().includes(searches.toLowerCase()) || property.status.toLowerCase().includes(searches.toLowerCase()) || property.type.toLowerCase().includes(searches.toLowerCase())
//   );

//   const countPending = propertyData.filter((property: any) => 
//     property.status.toLowerCase().includes('pending')
//   )
//   const countActive = propertyData.filter((property: any) => 
//     property.status.toLowerCase().includes('pending')
//   )
  

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Main Content */}
//       <main className="flex-1 ">
//         {/* Content */}
//         <div className="p-">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
//               My Properties
//             </h1>
//             <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
//                   onChange={handleSearch}
//                 />
//               </div>
//               <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleRouter}>
//                 <Plus className="h-5 w-5" />
//                 <span>Add New Property</span>
//               </button>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="mb-6">
//             <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg w-fit">
//               <TabButton text={`All (${count})`} active />
//               <TabButton text="Active (0)" active/>
//               <TabButton text={`Pending (${countPending.length})`} active />
//             </div>
//           </div>

//           {/* Property Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

//           {filteredProperties.length ? (
//             filteredProperties.map((property: any) => (
//               <PropertyCard key={property._id} status={property.status} src={property.images[1] ? `https://limpiar-backend.onrender.com/api/properties/gridfs/files/${property.images[1]}`: '/listing.png'} location={property.address} type={property.type} name={property.name} propertyId={property._id} />
//             ))
//           ) : (
//             <p className="text-gray-500">No properties available.</p>
//           )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function TabButton({text,active = false}: {text: string; active?: boolean;}) {
//   return (
//     <button
//       className={`py-2 px-4 rounded-lg ${
//         active
//           ? "bg-white text-gray-800 font-medium"
//           : "text-gray-500 bg-gray-50"
//       }`}
//     >
//       {text}
//     </button>
//   );
// }

// function PropertyCard({ status, src, location, type, name, propertyId }: { status: string; src: string; location: string; type: string; name: string; propertyId: string }) {
//   const router = useRouter();
//   const handleViewDetails = (id: string) => {
//     router.push(`/my-property/${id}`)
//   };
//   return (
//     <div className="flex flex-col">
//       <div className="relative">
//         <Image 
//           src= {src}
//           alt="Property"
//           width={300}
//           height={200}
//           className="w-full h-48 object-cover rounded-lg"
//           priority
//         />
//         <div
//           className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
//             status === "active"
//               ? "bg-blue-100 text-blue-500"
//               : "bg-yellow-100 text-yellow-500"
//           }`}
//         >
//           {status === "active" ? "Active" : "Pending"}
//         </div>

//       </div>
//       <h3 className="text-lg font-semibold mt-3">{name}</h3>
//       <div className="flex items-center text-gray-500 text-sm mt-1">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="mr-1"
//         >
//           <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//           <circle cx="12" cy="10" r="3"></circle>
//         </svg>
//         <span>{location.split(" ").slice(0, 3).join(" ")}</span>
//       </div>
//       <div className="flex justify-between items-center mt-4 pt-4 border-t">
//         <span className="text-gray-500 w-[60%] break-words text-sm">{type}</span>
//         <button className="flex items-center text-blue-500 text-sm" onClick={() => handleViewDetails(propertyId)}>
//           View Details
//           <ChevronRight className="h-4 w-4 ml-1" />
//         </button>
//       </div>
//     </div>
//   );
// }




"use client"

import Image from "next/image";
import { Search, Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Property } from "@/types/property";

interface PropertyListingProps {
  propertyData: Property[] | never;
  count: number;
}

export default function PropertyListing({ propertyData, count }: PropertyListingProps) {
  const router = useRouter();
  const [searches, setSearches] = useState<string>('');

  const handleRouter = () => {
    router.push("/my-property/add")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearches(e.target.value);
  }

  const filteredProperties = propertyData.filter((property) =>
    property.name.toLowerCase().includes(searches.toLowerCase()) || 
    property.address.toLowerCase().includes(searches.toLowerCase()) || 
    property.status.toLowerCase().includes(searches.toLowerCase()) || 
    property.type.toLowerCase().includes(searches.toLowerCase())
  );

  const countPending = propertyData.filter((property) => 
    property.status.toLowerCase().includes('pending')
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 ">
        {/* Content */}
        <div className="p-">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              My Properties
            </h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                  onChange={handleSearch}
                />
              </div>
              <button 
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg" 
                onClick={handleRouter}
              >
                <Plus className="h-5 w-5" />
                <span>Add New Property</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg w-fit">
              <TabButton text={`All (${count})`} active />
              <TabButton text="Active (0)" active/>
              <TabButton text={`Pending (${countPending.length})`} active />
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.length ? (
              filteredProperties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  status={property.status} 
                  src={property.images[1] ? `https://limpiar-backend.onrender.com/api/properties/gridfs/files/${property.images[1]}`: '/listing.png'} 
                  location={property.address} 
                  type={property.type} 
                  name={property.name} 
                  propertyId={property._id} 
                />
              ))
            ) : (
              <p className="text-gray-500">No properties available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({text, active = false}: {text: string; active?: boolean;}) {
  return (
    <button
      className={`py-2 px-4 rounded-lg ${
        active
          ? "bg-white text-gray-800 font-medium"
          : "text-gray-500 bg-gray-50"
      }`}
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
    router.push(`/my-property/${id}`)
  };
  
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Image 
          src={src}
          alt="Property"
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-lg"
          priority
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
            status === "active"
              ? "bg-blue-100 text-blue-500"
              : "bg-yellow-100 text-yellow-500"
          }`}
        >
          {status === "active" ? "Active" : "Pending"}
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-3">{name}</h3>
      <div className="flex items-center text-gray-500 text-sm mt-1">
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
          className="mr-1"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>{location.split(" ").slice(0, 3).join(" ")}</span>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className="text-gray-500 w-[60%] break-words text-sm">{type}</span>
        <button 
          className="flex items-center text-blue-500 text-sm" 
          onClick={() => handleViewDetails(propertyId)}
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}