import PropertyInfo from "@/components/property-metrics/property-info";
interface Params {
  [key: string]: string | string[] | undefined;
}

// Correctly type the page component according to Next.js expectations
export default function PropertyMetrics({
  params
}: {
  params: { id: string }
}) {
  const { id } = params;
  
  return (
    <div>
      {/* Pass the id as a prop to the Client Component */}
      <PropertyInfo id={id} />
    </div>
  );
}

// Define the expected param types for this page
// This helps Next.js understand your route parameters
export interface PropertyMetricsParams extends Params {
  id: string;
}

// Type the generateMetadata function
export async function generateMetadata({ 
  params 
}: { 
  params: PropertyMetricsParams 
}) {
  return {
    title: `Property Details - ${params.id}`,
  };
}