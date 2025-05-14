"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import AssignCleanerModal from "./assign-cleaner-modal"
import type { Task, Cleaner } from "../lib/types"

// Mock data for tasks
const initialTasks: Task[] = [
  {
    id: 1,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "Pending",
    assignedTo: null,
    isConfirmed: false,
  },
  {
    id: 2,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "Pending",
    assignedTo: null,
    isConfirmed: false,
  },
  {
    id: 3,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "Pending",
    assignedTo: null,
    isConfirmed: false,
  },
  {
    id: 4,
    serviceType: "Janitorial Service",
    property: "Azure Haven",
    propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
    date: "12 Feb '25, Sat",
    time: "7:30 AM - 9:30 AM",
    notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
    status: "Pending",
    assignedTo: null,
    isConfirmed: false,
  },
]

interface TaskListProps {
  activeTab: "pending" | "active" | "delayed" | "paused" | "completed" | "cancelled"
}

export default function TaskList({ activeTab }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  })


  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "pending") return task.status === "Pending"
    if (activeTab === "active") return task.status === "Not Started" || task.status === "In Progress"
    if (activeTab === "delayed") return task.status === "Delayed"
    if (activeTab === "paused") return task.status === "Paused"
    if (activeTab === "completed") return task.status === "Completed"
    if (activeTab === "cancelled") return task.status === "Cancelled"
    return true
  })


  const handleConfirmBooking = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isConfirmed: true,
              status: "Not Started",
            }
          : task,
      ),
    )
  }


  const openAssignModal = (taskId: number) => {
    setCurrentTaskId(taskId)
    setIsAssignModalOpen(true)
  }


  const handleAssignCleaner = (cleaner: Cleaner) => {
    if (!currentTaskId) return

    setTasks(
      tasks.map((task) =>
        task.id === currentTaskId
          ? {
              ...task,
              assignedTo: cleaner,
            }
          : task,
      ),
    )

    setIsAssignModalOpen(false)
    showNotification("Successfully assigned")
  }

  
  const showNotification = (message: string) => {
    setNotification({ message, visible: true })
    setTimeout(() => {
      setNotification({ message: "", visible: false })
    }, 3000)
  }

  return (
    <>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
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

            {task.isConfirmed ? (
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
                    <button
                      onClick={() => openAssignModal(task.id)}
                      className="text-primary font-medium hover:underline"
                    >
                      Assign Cleaner
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {task.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-end p-4 border-t">
                <button
                  onClick={() => handleConfirmBooking(task.id)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assign Cleaner Modal */}
      {isAssignModalOpen && (
        <AssignCleanerModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignCleaner}
        />
      )}

      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed bottom-4 left-4 bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 z-50">
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ ...notification, visible: false })}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
