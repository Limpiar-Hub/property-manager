"use client"

import { useState, useEffect } from "react"
import { Search, ClipboardX } from "lucide-react"
import TaskList from "../../../../cleaningBusiness/component/task-list"
import { useAppSelector } from "@/hooks/useReduxHooks"
import { fetchCleaners } from "@/cleaningBusiness/lib/services/cleanerService"
import { fetchBookingDetails, type Booking } from "@/cleaningBusiness/lib/services/bookingService"

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "completed">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabCounts, setTabCounts] = useState({
    pending: 0,
    active: 0,
    completed: 0,
  })

  const { token, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token || !user?._id) {
        setError("Authentication required")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const businessData = await fetchCleaners(user._id, token)
        
        if (!businessData.tasks || businessData.tasks.length === 0) {
          setTasks([])
          setIsLoading(false)
          updateTabCounts([])
          return
        }

        const taskDetails = await Promise.all(
          businessData.tasks.map(async (taskId: string) => {
            try {
              const details = await fetchBookingDetails(taskId, token)
              return details
            } catch (err) {
              console.error(`Error fetching task ${taskId}:`, err)
              return null
            }
          })
        )

        const validTasks = taskDetails.filter(Boolean) as Booking[]
        setTasks(validTasks)
        updateTabCounts(validTasks)
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [token, user])

  const updateTabCounts = (tasks: Booking[]) => {
    const counts = {
      pending: 0,
      active: 0,
      completed: 0,
    }

    tasks.forEach((task) => {
      const status = task.status?.toLowerCase() || ""
      if (status === "pending") {
        counts.pending++
      } else if (status === "confirmed" || status === "not started" || status === "in progress") {
        counts.active++
      } else if (status === "completed") {
        counts.completed++
      }
    })

    setTabCounts(counts)
  }

  const handleTaskUpdate = (updatedTask: Booking) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    )
    // Recalculate counts with updated tasks
    updateTabCounts(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
  }

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
            Pending ({tabCounts.pending})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "active" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Active ({tabCounts.active})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "completed" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
            }`}
          >
            Completed ({tabCounts.completed})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-[250px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardX className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500 max-w-md">There are no tasks assigned to your business at the moment.</p>
        </div>
      ) : (
        <TaskList 
          activeTab={activeTab} 
          searchQuery={searchQuery} 
          allTasks={tasks}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}