import PropertyMetrics from "@/components/property-metrics/property-metrics"
import PropertyDetails from "@/components/property-metrics/property-details"
import PropertyBookings from "@/components/property-metrics/property-bookings"


export default function Dashboard() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <PropertyMetrics bookings={[]} />
      <PropertyDetails PropertyDetailsData={{ 
        name: "Sample Property", 
        address: "123 Main Street, Cityville", 
        images: ["image1.jpg", "image2.jpg"] 
      }} />
      <PropertyBookings bookings={[]} />
    </div>
  )
}

