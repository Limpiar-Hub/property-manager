"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import TaskList from "../../../../cleaningBusiness/component/task-list"

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "delayed" | "paused" | "completed" | "cancelled">(
    "pending",
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "pending" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Pending (6)
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "active" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Active (6)
          </button>
          <button
            onClick={() => setActiveTab("delayed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "delayed" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Delayed (6)
          </button>
          <button
            onClick={() => setActiveTab("paused")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "paused" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Paused (6)
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "completed" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Completed (50)
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "cancelled" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Cancelled (50)
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-[250px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <TaskList activeTab={activeTab} />
    </div>
  )
}
