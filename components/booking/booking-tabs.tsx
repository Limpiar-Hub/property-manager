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
    <div className="mb-4 px-4 sm:px-6 lg:px-8 overflow-x-auto">
      <div className="flex space-x-2 min-w-[500px] sm:min-w-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as BookingStatus)}
            className={`
              py-2 px-4 text-sm font-medium whitespace-nowrap rounded-md transition-colors
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border border-blue-700"
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