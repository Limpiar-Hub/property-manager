"use client"

import { useAppSelector } from "@/hooks/useReduxHooks"
import { cn } from "@/lib/utils"

export default function ProgressSteps() {
  const { step } = useAppSelector((state) => state.booking)

  const steps = [
    { id: 1, name: "Service Type" },
    { id: 2, name: "Property" },
    { id: 3, name: "Date" },
    { id: 4, name: "Time" },
    // { id: 5, name: "Additional Notes" },
  ]

  return (
    <div className="flex justify-between items-start w-full mb-8">
      {steps.map((s) => {
        const isActive = step === s.id
        const isCompleted = step > s.id

        return (
          <div key={s.id} className="flex flex-col items-center relative">
            <div
              className={cn(
                "text-sm font-medium mb-2 text-center",
                isActive ? "text-blue-500" : isCompleted ? "text-blue-500 line-through" : "text-gray-500",
              )}
            >
              {s.id}. {s.name}
            </div>
            <div className={cn("h-0.5 w-16", isActive || isCompleted ? "bg-blue-500" : "bg-gray-200")} />
          </div>
        )
      })}
    </div>
  )
}

