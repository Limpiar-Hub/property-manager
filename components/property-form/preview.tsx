

// "use client"

// import { useAppSelector } from "@/hooks/useReduxHooks"
// import { MapPin } from "lucide-react"
// import Image from "next/image"
// import { jwtDecode } from "jwt-decode";
// import { useImageContext } from "../imageFileProvider";

// import SuccessAddNewProperty from "../successAddNewProperty";

// export default function Preview() {
//   const property = useAppSelector((state) => state.property)
//   const { imageFiles, removeFile } = useImageContext();
  
//   // const coverImage = property.images.find((img) => img.isCover)
//     const { token, user, loading } = useAppSelector((state) => state.auth);
//     const { step, category, subCategory, title, location, images } = useAppSelector((state) => state.property)


//   return (
//     <div className="max-w-6xl mx-auto  p-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Image Gallery */}
//         <div className="grid grid-cols-2 gap-4">
//           {property.images.slice(0, 8).map((image, index) => (
//             <div key={image.url} className="relative aspect-square rounded-lg overflow-hidden">
//               <Image
//                 src={image.url || "/placeholder.png"}
//                 alt={`Property image ${index + 1}`}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Property Details */}
//         <div className="space-y-6">
//           {/* Property Header */}
//           <div>
//             <h1 className="text-[32px] font-bold text-gray-900">{property.title}</h1>
//             <div className="flex items-center mt-2 text-gray-600">
//               <MapPin size={40} className="mr-2" />
//               <span className="text-base">{property.location.address || "Location not set"}</span>
//             </div>
//           </div>

//           {/* Owner Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <div className="flex items-center gap-4">
//               <div className="relative w-16 h-16 rounded-full overflow-hidden">
//                 <Image src="/darren.png" alt="Property Owner" fill className="object-cover" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">{user?.fullName}</h3>
//                 <p className="text-gray-600">Property Owner</p>
//               </div>
//             </div>
//           </div>

//           {/* Property Details Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-2xl font-semibold mb-6">Property Detail</h2>
//             {/* <div className="space-y-4">
//               {[
//                 { label: "Floors", value: property.units.floors },
//                 { label: "Units", value: property.units.units },
//                 { label: "Offices Rooms", value: property.units.officesRooms },
//                 { label: "Meeting Rooms", value: property.units.meetingRooms },
//                 { label: "Lobbies", value: property.units.lobbies },
//                 { label: "Restrooms", value: property.units.restrooms },
//                 { label: "Break Rooms", value: property.units.breakRooms },
//                 { label: "Cafeteria", value: property.units.cafeteria },
//                 { label: "Gym", value: property.units.gym },
//               ].map((item) => (
//                 <div key={item.label} className="flex justify-between items-center">
//                   <span className="text-[15px] text-gray-600">{item.label}</span>
//                   <span className="text-[15px] font-medium text-gray-900">{item.value}</span>
//                 </div>
//               ))}
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useAppSelector } from "@/hooks/useReduxHooks"
import { MapPin } from "lucide-react"
import Image from "next/image"

export default function Preview() {
  const property = useAppSelector((state) => state.property)
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(0, 8).map((image, index) => (
            <div key={image.url} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.url || "/placeholder.png"}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          {/* Property Header */}
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin size={40} className="mr-2" />
              <span className="text-base">{property.location.address || "Location not set"}</span>
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src="/darren.png" alt="Property Owner" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.fullName}</h3>
                <p className="text-gray-600">Property Owner</p>
              </div>
            </div>
          </div>

          {/* Property Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-3xl font-semibold mb-6">Property Details</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-xl font-semibold">Name</span>
                <span className="relative max-w-[50%]">{property.title}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-xl font-semibold">Type</span>
                <span className="relative max-w-[50%]">{property.category}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-xl font-semibold">Sub Type</span>
                <span className="relative max-w-[50%]">{property.subCategory}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-xl font-semibold">Address</span>
                <span className="relative max-w-[55%]">{property.location.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}