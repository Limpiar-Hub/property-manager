import PropertyMetrics from "@/components/property-metrics/property-metrics"
import PropertyDetails from "@/components/property-metrics/property-details"
import PropertyBookings from "@/components/property-metrics/property-bookings"

// Update the main container to have better padding on mobile
export default function Dashboard() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <PropertyMetrics />
      <PropertyDetails />
      <PropertyBookings />
    </div>
  )
}

