"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, MapPin, FileText, User, ClipboardCheck, X, Check } from "lucide-react"
import AssignCleanerModal from "@/cleaningBusiness/component/assign-cleaner-modal"
import { useAppSelector } from "@/hooks/useReduxHooks"
import { fetchCleaners } from "@/cleaningBusiness/lib/services/cleanerService"
import { assignCleanerToTask, reAssignCleanerToTask, fetchBookingDetails, type Booking } from "@/cleaningBusiness/lib/services/bookingService"

export default function TaskDetail() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  })

  const { token, user } = useAppSelector((state) => state.auth)

  // Fetch task details
  useEffect(() => {
    const getTaskDetails = async () => {
      if (!token || !taskId) {
        setError("Authentication required or invalid task ID")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const taskDetails = await fetchBookingDetails(taskId, token)
        setTask(taskDetails)
      } catch (err: any) {
        console.error(`Error fetching task details:`, err)
        setError(err.message || "Failed to fetch task details")
      } finally {
        setIsLoading(false)
      }
    }

    getTaskDetails()
  }, [token, taskId])

  // Handle assign/reassign cleaner
  const handleAssignCleaner = async (cleanerId: string) => {
    if (!token || !taskId) return

    try {
      setIsAssignModalOpen(false)
      
      // Determine which endpoint to use based on current assignment status
      if (task?.cleanerId) {
        // Reassign if cleaner is already assigned
        await reAssignCleanerToTask(
          {
            bookingId: taskId,
            cleanerId: cleanerId,
          },
          token,
        )
      } else {
        // Initial assignment if no cleaner is assigned
        await assignCleanerToTask(
          {
            bookingId: taskId,
            cleanerId: cleanerId,
          },
          token,
        )
      }

      // Refetch task details to get updated data
      const updatedTask = await fetchBookingDetails(taskId, token)
      setTask(updatedTask)
      
      // Show success modal
      setIsSuccessModalOpen(true)
    } catch (err: any) {
      showNotification(err.message || "Failed to assign cleaner", "error")
    }
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true })
    setTimeout(() => {
      setNotification({ ...notification, visible: false })
    }, 3000)
  }

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return ''
    return status.toLowerCase().replace('_', ' ').trim()
  }

  const status = normalizeStatus(task?.status)

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div>
        <Link href="/cleaning-business/tasks" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Link>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || "Task not found"}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/cleaning-business/tasks" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tasks
      </Link>

      <div className="bg-white border rounded-lg overflow-hidden">
        {/* Task Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{task.serviceType || "Task"}</h1>
              <p className="text-gray-500">{task.propertyId?.name || "No property specified"}</p>
            </div>
            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "not started"
                      ? "bg-blue-100 text-blue-800"
                      : status === "in progress"
                        ? "bg-green-100 text-green-800"
                        : status === "completed"
                          ? "bg-purple-100 text-purple-800"
                          : status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                }`}
              >
                {task.status
                  ? task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("_", " ")
                  : "Unknown Status"}
              </span>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {task.date ? new Date(task.date).toLocaleDateString() : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {task.startTime && task.endTime 
                      ? `${task.startTime} - ${task.endTime}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Property Address</p>
                  <p className="font-medium">{task.propertyId?.address || "Not specified"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Property Manager</p>
                  {task.propertyManagerId ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {task.propertyManagerId.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium">{task.propertyManagerId.fullName}</p>
                    </div>
                  ) : (
                    <p className="font-medium">Not specified</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium">{task.serviceType || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${task.price || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Cleaner or Action Button */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Cleaner Assignment</h2>
          
          {task.cleanerId ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {task.cleanerId.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{task.cleanerId.fullName}</p>
                  <p className="text-sm text-gray-500">Currently assigned</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors w-full sm:w-auto"
              >
                Reassign Cleaner
              </button>
            </div>
          ) : status === "pending" ? (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Confirm Booking
            </button>
          ) : (
            <div className="text-gray-500">No cleaner assigned</div>
          )}
        </div>
      </div>

      {/* Assign Cleaner Modal */}
      {isAssignModalOpen && (
        <AssignCleanerModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignCleaner}
          currentCleanerId={task.cleanerId?._id}
          isReassign={!!task.cleanerId}
        />
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {task.cleanerId ? "Cleaner Reassigned" : "Cleaner Assigned"} Successfully
              </h3>
              <p className="text-gray-500 mb-6">
                {task.cleanerId 
                  ? "The cleaner has been reassigned to this task"
                  : "The cleaner has been assigned to this task"}
              </p>
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false)
                  router.push("/cleaning-business/tasks")
                }}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Back to Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.visible && (
        <div
          className={`fixed bottom-4 left-4 px-4 py-2 rounded-md flex items-center gap-2 z-50 ${
            notification.type === "success" ? "bg-green-800 text-white" : "bg-red-800 text-white"
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ ...notification, visible: false })}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}