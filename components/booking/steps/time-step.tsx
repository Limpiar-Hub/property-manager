// "use client"

// import { useState } from "react"
// import { useAppDispatch } from "@/hooks/useReduxHooks"
// import { setStep, setTime } from "@/redux/features/booking/bookingSlice"
// import { ChevronLeft, ChevronDown, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface TimeSlot {
//   id: string
//   startTime: string
//   // endTime: string
// }

// export default function TimeStep() {
//   const dispatch = useAppDispatch()
//   // const { time } = useAppSelector((state) => state.booking)
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ id: "1", startTime: "7:30 AM" }])

//   const handleBack = () => {
//     dispatch(setStep(3))
//   }

//   // const handleNext = () => {
//   //   // Save the time slot information to the Redux store
//   //   const formattedTime = timeSlots.map((slot) => `${slot.startTime} - ${slot.endTime}`).join(", ")
//   //   dispatch(setTime(formattedTime))
//   //   dispatch(setStep(5))
//   // }

//   const handleNext = () => {
//     const formattedTime = timeSlots.map((slot) => `${slot.startTime}`).join(", ")
//     dispatch(setTime(formattedTime))
//     dispatch(setStep(5)) // Go to preview
//   }

//   const updateTimeSlot = (id: string, field: "startTime" | "endTime", value: string) => {
//     const updatedSlots = timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
//     setTimeSlots(updatedSlots)
//   }

//   const addTimeSlot = () => {
//     // Generate a unique ID
//     const newId = Date.now().toString()
//     setTimeSlots([...timeSlots, { id: newId, startTime: "7:30 AM", endTime: "9:30 AM" }])
//   }

//   const removeTimeSlot = (id: string) => {
//     if (timeSlots.length > 1) {
//       setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
//     }
//   }

//   const isNextEnabled = () => {
//     return timeSlots.every((slot) => slot.startTime && slot.endTime)
//   }

//   const timeOptions = [
//     "6:00 AM",
//     "6:30 AM",
//     "7:00 AM",
//     "7:30 AM",
//     "8:00 AM",
//     "8:30 AM",
//     "9:00 AM",
//     "9:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "12:00 PM",
//     "12:30 PM",
//     "1:00 PM",
//     "1:30 PM",
//     "2:00 PM",
//     "2:30 PM",
//     "3:00 PM",
//     "3:30 PM",
//     "4:00 PM",
//     "4:30 PM",
//     "5:00 PM",
//     "5:30 PM",
//     "6:00 PM",
//     "6:30 PM",
//     "7:00 PM",
//     "7:30 PM",
//     "8:00 PM",
//   ]

//   return (
//     <div className="flex flex-col">
//       <h3 className="text-lg font-semibold mb-6">Select time</h3>

//       <div className="space-y-4">
//         {timeSlots.map((slot) => (
//           <div key={slot.id} className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <p className="text-sm text-gray-600 mb-2">Start time:</p>
//               <div className="relative">
//                 <select
//                   value={slot.startTime}
//                   onChange={(e) => updateTimeSlot(slot.id, "startTime", e.target.value)}
//                   className="w-full p-2 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {timeOptions.map((time) => (
//                     <option key={`start-${time}`} value={time}>
//                       {time}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-2.5 pointer-events-none">
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </div>
//               </div>
//             </div>

//             {/* <div className="flex-1">
//               <p className="text-sm text-gray-600 mb-2">End time:</p>
//               <div className="relative">
//                 <select
//                   value={slot.endTime}
//                   onChange={(e) => updateTimeSlot(slot.id, "endTime", e.target.value)}
//                   className="w-full p-2 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {timeOptions.map((time) => (
//                     <option key={`end-${time}`} value={time}>
//                       {time}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-2.5 pointer-events-none">
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </div>
//               </div>
//             </div> */}

//             {timeSlots.length > 1 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => removeTimeSlot(slot.id)}
//                 className="text-red-500 hover:text-red-700 self-end mb-0.5"
//               >
//                 Remove
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>

//       <Button
//         variant="ghost"
//         onClick={addTimeSlot}
//         className="text-blue-500 hover:text-blue-700 flex items-center w-fit mt-4"
//       >
//         <Plus className="h-4 w-4 mr-1" /> Add another slot
//       </Button>

//       <div className="flex justify-between mt-8">
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
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { setStep, setTime } from "@/redux/features/booking/bookingSlice";
import { ChevronLeft, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  id: string;
  startTime: string;
}

export default function TimeStep() {
  const dispatch = useAppDispatch();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ id: "1", startTime: "7:30 AM" }]);

  const handleBack = () => {
    dispatch(setStep(3));
  };

  const handleNext = () => {
    // Save the time slot information to the Redux store
    const formattedTime = timeSlots.map((slot) => slot.startTime).join(", ");
    dispatch(setTime(formattedTime));
    dispatch(setStep(5)); // Go to preview
  };

  const updateTimeSlot = (id: string, field: "startTime", value: string) => {
    const updatedSlots = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(updatedSlots);
  };

  const addTimeSlot = () => {
    // Generate a unique ID
    const newId = Date.now().toString();
    setTimeSlots([...timeSlots, { id: newId, startTime: "7:30 AM" }]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  const isNextEnabled = () => {
    return timeSlots.every((slot) => slot.startTime);
  };

  const timeOptions = [
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
  ];

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Select time</h3>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Start time:</p>
              <div className="relative">
                <select
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(slot.id, "startTime", e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {timeSlots.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTimeSlot(slot.id)}
                className="text-red-500 hover:text-red-700 self-end mb-0.5"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={addTimeSlot}
        className="text-blue-500 hover:text-blue-700 flex items-center w-fit mt-4"
      >
        <Plus className="h-4 w-4 mr-1" /> Add another slot
      </Button>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isNextEnabled()}
          className={`${isNextEnabled() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200"}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}