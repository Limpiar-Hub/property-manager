"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { closeModal } from "@/redux/features/booking/bookingSlice";
import { X } from "lucide-react";
import ServiceTypeStep from "./steps/service-type-step";
import PropertyStep from "./steps/property-step";
import DateStep from "./steps/date-step";
import NotesStep from "./steps/notes-step";
import BookingPreview from "./booking-preview";
import ProgressSteps from "./progress-steps";
import dynamic from "next/dynamic";
const TimeStep = dynamic(() => import("./steps/time-step"), {
  ssr: false,
});

export default function BookingModal() {
  const dispatch = useAppDispatch();
  const { isModalOpen, step } = useAppSelector((state) => state.booking);

  if (!isModalOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceTypeStep />;
      case 2:
        return <PropertyStep />;
      case 3:
        return <DateStep />;
      case 4:
        return <TimeStep />;
      // case 5:
      //   return <NotesStep />;
      case 5:
        return <BookingPreview />;
      default:
        return <ServiceTypeStep />;
    }
  };

 
  const showHeader = step < 5;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.6), 0 50px 100px -20px rgba(0, 0, 0, 0.4)' }}>
        {showHeader && (
          <>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Booking</h2>
              <button
                onClick={() => dispatch(closeModal())}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <ProgressSteps />
              {renderStep()}
            </div>
          </>
        )}

        {!showHeader && (
          <div className="p-6 flex-1 overflow-y-auto">{renderStep()}</div>
        )}
      </div>
    </div>
  );
}
