// "use client";

// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   addYears,
//   addMonths,
//   addWeeks,
//   addDays,
//   addHours,
//   addMinutes,
//   addSeconds,
//   startOfDay,
//   endOfMonth,
//   format,
//   getDay,
//   isEqual,
//   isSameMonth,
//   isToday,
//   startOfMonth,
//   startOfToday,
//   isBefore,
// } from "date-fns";

// interface CalendarProps {
//   type: "one-time" | "multiple-day";
//   onSelect: (date: string) => void;
//   onRangeSelect: (range: { start: string; end: string }) => void;
//   selectedDate?: string;
//   dateRange?: { start: string; end: string };
// }

// function eachDayOfIntervalCustom({ start, end }: { start: Date; end: Date }) {
//   const dates = [];
//   let currentDate = startOfDay(start);
//   const endDate = startOfDay(end);

//   while (currentDate <= endDate) {
//     dates.push(currentDate);
//     currentDate = addDays(currentDate, 1);
//   }

//   return dates;
// }

// function addCustom(
//   date: Date,
//   values: {
//     years?: number;
//     months?: number;
//     weeks?: number;
//     days?: number;
//     hours?: number;
//     minutes?: number;
//     seconds?: number;
//   }
// ): Date {
//   let updatedDate = date;

//   if (values.years) {
//     updatedDate = addYears(updatedDate, values.years);
//   }
//   if (values.months) {
//     updatedDate = addMonths(updatedDate, values.months);
//   }
//   if (values.weeks) {
//     updatedDate = addWeeks(updatedDate, values.weeks);
//   }
//   if (values.days) {
//     updatedDate = addDays(updatedDate, values.days);
//   }
//   if (values.hours) {
//     updatedDate = addHours(updatedDate, values.hours);
//   }
//   if (values.minutes) {
//     updatedDate = addMinutes(updatedDate, values.minutes);
//   }
//   if (values.seconds) {
//     updatedDate = addSeconds(updatedDate, values.seconds);
//   }

//   return updatedDate;
// }

// function parseCustom(dateString: string, formatString: string): Date {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   if (formatString === "MMM-yyyy") {
//     const [month, year] = dateString.split("-");
//     const monthIndex = months.indexOf(month);
//     if (monthIndex !== -1) {
//       return new Date(parseInt(year), monthIndex, 1);
//     }
//   }

//   throw new Error("Invalid date format");
// }

// export default function Calendar({
//   type,
//   onSelect,
//   onRangeSelect,
//   selectedDate,
//   dateRange,
// }: CalendarProps) {
//   const today = startOfToday();
//   const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
//   const firstDayCurrentMonth = parseCustom(currentMonth, "MMM-yyyy"); // Use custom parsing function
//   const [rangeStart, setRangeStart] = useState<Date | null>(
//     dateRange?.start ? new Date(dateRange.start) : null
//   );

//   const days = eachDayOfIntervalCustom({
//     start: startOfMonth(firstDayCurrentMonth),
//     end: endOfMonth(firstDayCurrentMonth),
//   });

//   const previousMonth = () => {
//     const firstDayNextMonth = addCustom(firstDayCurrentMonth, { months: -1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   };

//   const nextMonth = () => {
//     const firstDayNextMonth = addCustom(firstDayCurrentMonth, { months: 1 });
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
//   };

//   const handleDateClick = (day: Date) => {
//     if (type === "one-time") {
//       onSelect(format(day, "yyyy-MM-dd"));
//     } else {
//       if (!rangeStart) {
//         setRangeStart(day);
//         onRangeSelect({
//           start: format(day, "yyyy-MM-dd"),
//           end: format(day, "yyyy-MM-dd"),
//         });
//       } else {
//         const start = isBefore(rangeStart, day) ? rangeStart : day;
//         const end = isBefore(rangeStart, day) ? day : rangeStart;
//         onRangeSelect({
//           start: format(start, "yyyy-MM-dd"),
//           end: format(end, "yyyy-MM-dd"),
//         });
//         setRangeStart(null);
//       }
//     }
//   };

//   const isInRange = (day: Date) => {
//     if (!dateRange) return false;

//     const start = new Date(dateRange.start).setHours(0, 0, 0, 0);
//     const end = new Date(dateRange.end).setHours(23, 59, 59, 999);
//     const currentDay = day.setHours(0, 0, 0, 0);

//     return currentDay >= start && currentDay <= end;
//   };

//   const isRangeStart = (day: Date) =>
//     dateRange?.start && isEqual(day, new Date(dateRange.start));
//   const isRangeEnd = (day: Date) =>
//     dateRange?.end && isEqual(day, new Date(dateRange.end));

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="font-semibold">
//           {format(firstDayCurrentMonth, "MMMM yyyy")}
//         </h2>
//         <div className="flex gap-1">
//           <Button variant="outline" size="icon" onClick={previousMonth}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="icon" onClick={nextMonth}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-7 gap-1 text-xs leading-6 text-center text-gray-500 mb-2">
//         <div>Su</div>
//         <div>Mo</div>
//         <div>Tu</div>
//         <div>We</div>
//         <div>Th</div>
//         <div>Fr</div>
//         <div>Sa</div>
//       </div>

//       <div className="grid grid-cols-7 gap-1">
//         {days.map((day, dayIdx) => {
//           const isSelected = selectedDate
//             ? isEqual(day, new Date(selectedDate))
//             : false;

//           return (
//             <div
//               key={day.toString()}
//               className={`
//                 ${dayIdx === 0 ? colStartClasses[getDay(day)] : ""}
//                 p-0.5
//               `}
//             >
//               <button
//                 onClick={() => handleDateClick(day)}
//                 className={`
//                   w-full aspect-square flex items-center justify-center text-sm rounded-full
//                   hover:bg-gray-100 relative
//                   ${
//                     !isSameMonth(day, firstDayCurrentMonth)
//                       ? "text-gray-300"
//                       : ""
//                   }
//                   ${isToday(day) ? "font-bold" : ""}
//                   ${
//                     isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""
//                   }
//                   ${isInRange(day) ? "bg-blue-50" : ""}
//                   ${
//                     isRangeStart(day)
//                       ? "bg-blue-500 text-white rounded-l-full"
//                       : ""
//                   }
//                   ${
//                     isRangeEnd(day)
//                       ? "bg-blue-500 text-white rounded-r-full"
//                       : ""
//                   }
//                 `}
//               >
//                 {format(day, "d")}
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// const colStartClasses = [
//   "",
//   "col-start-2",
//   "col-start-3",
//   "col-start-4",
//   "col-start-5",
//   "col-start-6",
//   "col-start-7",
// ];


"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
} from "date-fns";

interface CalendarProps {
  onSelect: (date: string) => void; // Callback for selecting a single date
  selectedDate?: string; // Currently selected date
}

export default function Calendar({ onSelect, selectedDate }: CalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

  // Generate all days for the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Navigate to the previous month
  const previousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  // Navigate to the next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date selection
  const handleDateClick = (day: Date) => {
    onSelect(format(day, "yyyy-MM-dd")); // Pass the selected date to the parent
  };

  return (
    <div className="p-4">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-xs leading-6 text-center text-gray-500 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Days of the month */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const isSelected = selectedDate
            ? isEqual(day, new Date(selectedDate))
            : false;

          return (
            <div
              key={day.toString()}
              className={`${
                dayIdx === 0 ? colStartClasses[getDay(day)] : ""
              } p-0.5`}
            >
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full aspect-square flex items-center justify-center text-sm rounded-full
                  hover:bg-gray-100
                  ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                  ${isToday(day) ? "font-bold" : ""}
                  ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                `}
              >
                {format(day, "d")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to align the first day of the month with the correct weekday
const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];