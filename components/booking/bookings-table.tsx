// "use client"

// import { Checkbox } from "@/components/ui/checkbox"

// interface Booking {
//   id: string
//   serviceType: string
//   property: string
//   date: string
//   time: string
//   note: string
//   payment: "Pending" | "Paid"
// }

// // Mock data
// const bookings: Booking[] = [
//   {
//     id: "1",
//     serviceType: "Cleaning",
//     property: "Opal Ridge Retreat",
//     date: "11 June, 2025",
//     time: "11:50 am",
//     note: "Craig provided great insight a...",
//     payment: "Pending",
//   },
//   {
//     id: "2",
//     serviceType: "Pool Cleaning",
//     property: "Sunset Villa",
//     date: "11 June, 2025",
//     time: "11:50 am",
//     note: "Had a great and fruitful discu...",
//     payment: "Paid",
//   },
//   // Add more mock data as needed
// ]

// interface BookingsTableProps {
//   status: string
//   searchQuery: string
// }

// export default function BookingsTable({ status, searchQuery }: BookingsTableProps) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-gray-200">
//             <th className="p-4 text-left">
//               <Checkbox />
//             </th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Service Type</th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Property</th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Date</th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Time</th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Additional Note</th>
//             <th className="p-4 text-left text-sm font-medium text-gray-500">Payment</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
//               <td className="p-4">
//                 <Checkbox />
//               </td>
//               <td className="p-4 text-sm">{booking.serviceType}</td>
//               <td className="p-4 text-sm">{booking.property}</td>
//               <td className="p-4 text-sm">{booking.date}</td>
//               <td className="p-4 text-sm">{booking.time}</td>
//               <td className="p-4 text-sm">{booking.note}</td>
//               <td className="p-4 text-sm">
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium
//                   ${booking.payment === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
//                 >
//                   {booking.payment}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
//         <div className="flex items-center gap-2">
//           <span>Rows per page:</span>
//           <select className="border rounded p-1">
//             <option>10</option>
//             <option>20</option>
//             <option>50</option>
//           </select>
//           <span>showing 1-10 of 30 rows</span>
//         </div>
//         <div className="flex gap-2">
//           <button className="px-2 py-1 border rounded hover:bg-gray-50">Previous</button>
//           <button className="px-2 py-1 border rounded hover:bg-gray-50">Next</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// import type { Booking } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

interface Booking {
  id: string
  serviceType: string
  property: string
  date: string
  time: string
  note: string
  payment: "Pending" | "Paid"
}

// Mock data
const bookings: Booking[] = [
  {
    id: "1",
    serviceType: "Cleaning",
    property: "Opal Ridge Retreat",
    date: "11 June, 2025",
    time: "11:50 am",
    note: "Craig provided great insight a...",
    payment: "Pending",
  },
  {
    id: "2",
    serviceType: "Pool Cleaning",
    property: "Sunset Villa",
    date: "11 June, 2025",
    time: "11:50 am",
    note: "Had a great and fruitful discu...",
    payment: "Paid",
  },
  // Add more mock data as needed
]

interface BookingsTableProps {
  status: string
  searchQuery: string
}

export default function BookingTable({ status, searchQuery  }: BookingsTableProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="min-w-[800px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">
                <Checkbox id="select-all" className="rounded-sm border-gray-300" />
              </th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Service Type</th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Property</th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Date</th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Time</th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Additional Note</th>
              <th className="p-3 sm:p-4 text-left font-normal text-gray-600 border border-gray-200">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="bg-white">
                <td className="p-3 sm:p-4 border border-gray-200">
                  <Checkbox id={`select-${booking.id}`} className="rounded-sm border-gray-300" />
                </td>
                <td className="p-3 sm:p-4 border border-gray-200">{booking.serviceType}</td>
                <td className="p-3 sm:p-4 border border-gray-200">{booking.property}</td>
                <td className="p-3 sm:p-4 border border-gray-200">{booking.date}</td>
                <td className="p-3 sm:p-4 border border-gray-200">{booking.time}</td>
                <td className="p-3 sm:p-4 border border-gray-200 max-w-[300px] truncate">{booking.additionalNote}</td>
                <td className="p-3 sm:p-4 border border-gray-200">{booking.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

