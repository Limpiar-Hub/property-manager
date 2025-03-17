"use client"

// import type { BookingStatus } from "@/lib/types"

export type BookingStatus = "active" | "pending" | "completed" | "cancelled"

interface BookingTabsProps {
  activeTab: BookingStatus
  setActiveTab: (tab: BookingStatus) => void
  counts: {
    active: number
    pending: number
    completed: number
    cancelled: number
  }
}

export default function BookingTabs({ activeTab, setActiveTab, counts }: BookingTabsProps) {
  const tabs = [
    { id: "active", label: "Active", count: counts.active },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", count: counts.completed },
    { id: "cancelled", label: "Cancelled", count: counts.cancelled },
  ]

  return (
    <div className="mb-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
      <div className="flex min-w-[500px] sm:min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as BookingStatus)}
            className={`
              py-2 sm:py-3 px-3 sm:px-4 text-sm font-medium whitespace-nowrap rounded-md
              ${
                activeTab === tab.id
                  ? "bg-white border border-gray-300"
                  : tab.id === "active"
                    ? "bg-gray-100"
                    : "bg-white"
              }
              mr-2
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  )
}

