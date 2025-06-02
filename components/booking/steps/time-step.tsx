"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { setStep, setTimeSlots } from "@/redux/features/booking/bookingSlice";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime?: string; // optional
}

export default function TimeStep() {
  const dispatch = useAppDispatch();

  const [timeSlots, setLocalTimeSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "7:30 AM", endTime: undefined },
  ]);

  const handleBack = () => dispatch(setStep(3));

  const handleNext = () => {
    dispatch(setTimeSlots(timeSlots));
    dispatch(setStep(5));
  };

  const updateTimeSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updated = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setLocalTimeSlots(updated);
  };

  const addTimeSlot = () => {
    const newId = Date.now().toString();
    setLocalTimeSlots([
      ...timeSlots,
      { id: newId, startTime: "7:30 AM", endTime: undefined },
    ]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setLocalTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  // Show End Time dropdown only if endTime is set or when user clicks "Add End Time" button
  const showEndTimeFor = new Set(
    timeSlots.filter((s) => s.endTime !== undefined).map((s) => s.id)
  );

  const addEndTimeToSlot = (id: string) => {
    // Set endTime to default first option (if undefined)
    setLocalTimeSlots((slots) =>
      slots.map((slot) =>
        slot.id === id && slot.endTime === undefined
          ? { ...slot, endTime: "8:00 AM" }
          : slot
      )
    );
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

  // Validate: startTime required, endTime optional
  // You can add more validation to ensure endTime > startTime if needed
  const isNextEnabled = () =>
    timeSlots.every((slot) => slot.startTime !== "") &&
    timeSlots.every(
      (slot) =>
        !slot.endTime || timeOptions.indexOf(slot.endTime) > timeOptions.indexOf(slot.startTime)
    );

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Select time(s)</h3>

      <div className="space-y-6">
        {timeSlots.map((slot, index) => (
          <div key={slot.id} className="flex flex-col md:flex-row gap-4 items-start">
            {/* Start Time */}
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

            {/* End Time (optional) */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">End time:</p>

              {slot.endTime !== undefined ? (
                <div className="relative">
                  <select
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, "endTime", e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOptions.map((time) => (
                      <option key={`end-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addEndTimeToSlot(slot.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add end time
                </Button>
              )}
            </div>

            {/* Remove Button */}
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

      {/* Add New Slot */}
      <Button
        variant="ghost"
        onClick={addTimeSlot}
        className="text-blue-500 hover:text-blue-700 flex items-center w-fit mt-4"
      >
        + Add another slot
      </Button>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isNextEnabled()}
          className={`${
            isNextEnabled()
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
