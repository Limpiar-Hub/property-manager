"use client";

import { useAppSelector } from "@/hooks/useReduxHooks";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

export default function ProgressSteps() {
  const { step } = useAppSelector((state) => state.property);

  const steps = [
    { id: 1, name: "Category" },
    { id: 2, name: "Title" },
    { id: 3, name: "Location" },
    { id: 4, name: "Image" },
  ];

  const currentStep = step === 1.5 ? 1 : step;

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 640 &&
      stepRefs.current[currentStep - 1]
    ) {
      stepRefs.current[currentStep - 1]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentStep]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 overflow-x-auto scrollbar-thin">
      <div className="flex min-w-[400px] sm:min-w-0 justify-between items-start">
        {steps.map((s, idx) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div
              key={s.id}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className="flex flex-col items-center relative flex-shrink-0 min-w-[120px] sm:min-w-0"
            >
              <div
                className={cn(
                  "text-xs sm:text-sm font-medium mb-2 text-center",
                  isActive
                    ? "text-blue-600"
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
                  "h-0.5 w-24 sm:w-40",
                  isActive || isCompleted ? "bg-blue-500" : "bg-gray-200"
                )}
              />
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
