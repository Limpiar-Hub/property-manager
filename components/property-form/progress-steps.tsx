"use client";

import { useAppSelector } from "@/hooks/useReduxHooks";
import { cn } from "@/lib/utils";

export default function ProgressSteps() {
  const { step } = useAppSelector((state) => state.property);

  const steps = [
    { id: 1, name: "Category" },
    { id: 2, name: "Title" },
    { id: 3, name: "Units" },
    { id: 4, name: "Location" },
    { id: 5, name: "Image" },
  ];

  // Handle the subcategory step (1.5) by considering it part of step 1
  const currentStep = step === 1.5 ? 1 : step;

  return (
    <div className="flex justify-between items-start w-full max-w-3xl mx-auto mb-10">
      {steps.map((s) => {
        const isActive = currentStep === s.id;
        const isCompleted = currentStep > s.id;

        return (
          <div key={s.id} className="flex flex-col items-center relative">
            <div
              className={cn(
                "text-sm font-medium mb-2",
                isActive
                  ? "text-black-500"
                  : isCompleted
                  ? "text-gray-500 line-through"
                  : "text-black"
              )}
            >
              {s.id}. {s.name}
            </div>
            {/* Separate line for each step */}
            <div
              className={cn(
                "h-0.5 w-24",
                isActive || isCompleted ? "bg-blue-500" : "bg-gray-200"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
