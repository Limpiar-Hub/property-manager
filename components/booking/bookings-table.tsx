
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



export default function BookingTable() {
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
                <td className="p-3 sm:p-4 border border-gray-200 max-w-[300px] truncate">Booking available</td>
                <td className="p-3 sm:p-4 border border-gray-200">Pending</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

