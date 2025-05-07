"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Image from "next/image"

const tasks = [
  {
    id: 1,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "In Progress",
    assignedTo: { name: "Jerome Bell", image: "/placeholder.svg" },
  },
  {
    id: 2,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "In Progress",
    assignedTo: { name: "Albert Flores", image: "/placeholder.svg" },
  },
  {
    id: 3,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "Not Started",
    assignedTo: null,
  },
  {
    id: 4,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "In Progress",
    assignedTo: { name: "Albert Flores", image: "/placeholder.svg" },
  },
]

export default function TasksTab() {
  const [activeTaskType, setActiveTaskType] = useState<"active" | "completed">("active")

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTaskType("active")}
            className={`px-4 py-2 rounded-md ${
              activeTaskType === "active" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Active Task (6)
          </button>
          <button
            onClick={() => setActiveTaskType("completed")}
            className={`px-4 py-2 rounded-md ${
              activeTaskType === "completed" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Completed Task (50)
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Service Type</p>
                <p className="font-medium">{task.serviceType}</p>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Property</p>
                <p className="font-medium">{task.property}</p>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Property Manager</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={task.propertyManager.image || "/placeholder.svg"}
                      alt={task.propertyManager.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="font-medium">{task.propertyManager.name}</p>
                </div>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="font-medium">{task.date}</p>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="font-medium">{task.time}</p>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
                <p className="font-medium truncate">{task.notes}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-t">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <p className="text-xs text-gray-500">Assigned to</p>
                {task.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={task.assignedTo.image || "/placeholder.svg"}
                        alt={task.assignedTo.name}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="font-medium">{task.assignedTo.name}</p>
                  </div>
                ) : (
                  <a href="#" className="text-primary font-medium">
                    Assign Cleaner
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "In Progress" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
