"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  setStep,
  setSelectedDate,
} from "@/redux/features/booking/bookingSlice";
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
