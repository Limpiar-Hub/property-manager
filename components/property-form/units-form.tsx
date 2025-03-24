"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setUnits } from "@/redux/features/addProperty/propertySlice";
import { Minus, Plus } from "lucide-react";

type UnitFieldKey = "floors" | "restrooms" | "units" | "breakRooms" | "officesRooms" | "cafeteria" | "meetingRooms" | "gym" | "lobbies";

interface UnitField {
  id: UnitFieldKey;
  label: string;
}

const unitFields: UnitField[] = [
  { id: "floors", label: "Floors" },
  { id: "restrooms", label: "Restrooms" },
  { id: "units", label: "Units" },
  { id: "breakRooms", label: "Break Rooms" },
  { id: "officesRooms", label: "Offices Rooms" },
  { id: "cafeteria", label: "Cafeteria" },
  { id: "meetingRooms", label: "Meeting Rooms" },
  { id: "gym", label: "Gym" },
  { id: "lobbies", label: "Lobbies" },
];

export default function UnitsForm() {
  const dispatch = useAppDispatch();
  const units = useAppSelector((state) => state.property.units);

  const handleIncrement = (field: UnitFieldKey) => {
    dispatch(setUnits({ [field]: units[field] + 1 }));
  };

  const handleDecrement = (field: UnitFieldKey) => {
    if (units[field] > 0) {
      dispatch(setUnits({ [field]: units[field] - 1 }));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">
        Add some details about your property
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {unitFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="number"
                value={units[field.id]}
                onChange={(e) =>
                  dispatch(
                    setUnits({
                      [field.id]: Math.max(
                        0,
                        Number.parseInt(e.target.value) || 0
                      ),
                    })
                  )
                }
                className="w-full text-left px-4 py-2 text-lg font-medium focus:outline-none focus:ring-0 border-none"
                min="0"
              />
              <div className="flex border-l border-gray-300">
                <button
                  type="button"
                  onClick={() => handleDecrement(field.id)}
                  className="px-4 py-2 hover:bg-gray-100"
                  disabled={units[field.id] <= 0}
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                <div className="w-px bg-gray-300"></div>
                <button
                  type="button"
                  onClick={() => handleIncrement(field.id)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}