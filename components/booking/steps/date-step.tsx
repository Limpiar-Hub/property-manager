// "use client"

// import { useState } from "react"
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
// import { setStep, setDateType, setSelectedDate, setDateRange, setRoutineDays } from "@/redux/features/booking/bookingSlice"
// import type { DateType } from "@/redux/features/booking/bookingSlice"
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { format } from "date-fns"
// import Calendar from "./calendar"

// const dateTypes = [
//   { id: "one-time", label: "One-time" },
//   { id: "multiple-day", label: "Multiple day" },
//   { id: "routine", label: "Routine" },
// ] as const

// const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// export default function DateStep() {
//   const dispatch = useAppDispatch()
//   const { date } = useAppSelector((state) => state.booking)
//   const [selectedDays, setSelectedDays] = useState<string[]>(date.routineDays || [])

//   const handleDateTypeChange = (value: DateType) => {
//     dispatch(setDateType(value))
//   }

//   const handleBack = () => {
//     dispatch(setStep(2))
//   }

//   const handleNext = () => {
//     if (isNextEnabled()) {
//       dispatch(setStep(4))
//     }
//   }

//   const handleDayToggle = (day: string) => {
//     const newSelectedDays = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day]
//     setSelectedDays(newSelectedDays)
//     dispatch(setRoutineDays(newSelectedDays))
//   }

//   const isNextEnabled = () => {
//     if (!date.type) return false
//     switch (date.type) {
//       case "one-time":
//         return !!date.selectedDate
//       case "multiple-day":
//         return !!(date.dateRange?.start && date.dateRange?.end)
//       case "routine":
//         return selectedDays.length > 0
//       default:
//         return false
//     }
//   }

//   const getSelectedDateDisplay = () => {
//     if (!date.type) return "--/--/--"
//     switch (date.type) {
//       case "one-time":
//         return date.selectedDate ? format(new Date(date.selectedDate), "d MMM yyyy, EEEE") : "--/--/--"
//       case "multiple-day":
//         if (!date.dateRange) return "--/--/--"
//         return `${format(new Date(date.dateRange.start), "d MMM yyyy, EEEE")} – ${format(
//           new Date(date.dateRange.end),
//           "d MMM yyyy, EEEE",
//         )}`
//       case "routine":
//         return selectedDays.length > 0 ? selectedDays.join(", ") : "--/--/--"
//       default:
//         return "--/--/--"
//     }
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <h3 className="text-lg font-semibold mb-6">Select date</h3>

//       <div className="flex-1 min-h-0">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
//           <div className="space-y-6">
//             <div>
//               <p className="text-sm text-gray-600 mb-2">Date types:</p>
//               <RadioGroup
//                 value={date.type || ""}
//                 onValueChange={(value) => handleDateTypeChange(value as DateType)}
//                 className="space-y-2"
//               >
//                 {dateTypes.map((type) => (
//                   <div key={type.id} className="flex items-center space-x-2">
//                     <RadioGroupItem value={type.id} id={type.id} />
//                     <label
//                       htmlFor={type.id}
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       {type.label}
//                     </label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600 mb-2">Selected date(s)</p>
//               <p className="text-sm font-medium">{getSelectedDateDisplay()}</p>
//             </div>
//           </div>

//           <div className="min-h-[400px]">
//             {date.type === "routine" ? (
//               <div className="grid grid-cols-2 gap-2">
//                 {weekDays.map((day) => (
//                   <Button
//                     key={day}
//                     variant={selectedDays.includes(day) ? "default" : "outline"}
//                     onClick={() => handleDayToggle(day)}
//                     className={selectedDays.includes(day) ? "bg-blue-500 hover:bg-blue-600" : ""}
//                   >
//                     {day}
//                   </Button>
//                 ))}
//               </div>
//             ) : (
//               date.type && (
//                 <Calendar
//                   type={date.type}
//                   onSelect={(date) => dispatch(setSelectedDate(date))}
//                   onRangeSelect={(range) => dispatch(setDateRange(range))}
//                   selectedDate={date.selectedDate}
//                   dateRange={date.dateRange}
//                 />
//               )
//             )}
//           </div>

//         </div>
//       </div>

//       <div className="flex justify-between mt-6 pt-4 border-t">
//         <Button variant="outline" onClick={handleBack}>
//           <ChevronLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//         <Button
//           onClick={handleNext}
//           disabled={!isNextEnabled()}
//           className={`${isNextEnabled() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200"}`}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   )
// }


"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setStep, setSelectedDate } from "@/redux/features/booking/bookingSlice";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Calendar from "./calendar";

export default function DateStep() {
  const dispatch = useAppDispatch();
  const { date } = useAppSelector((state) => state.booking);

  const handleBack = () => {
    dispatch(setStep(2));
  };

  const handleNext = () => {
    if (date.selectedDate) {
      dispatch(setStep(4));
    }
  };

  const getSelectedDateDisplay = () => {
    return date.selectedDate
      ? format(new Date(date.selectedDate), "d MMM yyyy, EEEE")
      : "--/--/--";
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-6">Select a date</h3>

      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 gap-6 h-full">
          <div>
            <p className="text-sm text-gray-600 mb-2">Selected date:</p>
            <p className="text-sm font-medium">{getSelectedDateDisplay()}</p>
          </div>

          <div className="min-h-[400px]">
            <Calendar
              // type="one-time"
              onSelect={(date) => dispatch(setSelectedDate(date))}
              selectedDate={date.selectedDate}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!date.selectedDate}
          className={`${
            date.selectedDate ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
