"use client";

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface BookingTabsProps {
  activeTab: BookingStatus;
  setActiveTab: (tab: BookingStatus) => void;
  counts: {
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}

export default function BookingTabs({ activeTab, setActiveTab, counts }: BookingTabsProps) {
  const tabs = [
    { id: "confirmed", label: "Active", count: counts.confirmed },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", count: counts.completed },
    { id: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  return (
 <div className="mb-4 overflow-x-auto flex bg-gray-50 p-2 sm:p-2 rounded-lg w-full sm:w-fit">
      <div className="flex space-x-2 min-w-[340px] sm:min-w-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as BookingStatus)}
            className={`
              flex-1 min-w-[120px] sm:min-w-0 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-colors
              ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white border"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}