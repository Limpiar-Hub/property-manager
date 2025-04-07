import PropertyInfo from "@/components/property-metrics/property-info";

export default async function PropertyMetrics({ params }: { params: { id: string } }) {
    const {id} = await params;
    return (
        <div>
            {/* Pass the id as a prop to the Client Component */}
            <PropertyInfo id={id} />
        </div>
    );
}
