"use client";

import PropertyInfo from "@/components/property-metrics/property-info";
import { useParams } from "next/navigation";

export default function PropertyMetrics() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <PropertyInfo id={id} />
    </div>
  );
}
