

"use client"
import { MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ClipboardX } from "lucide-react"
import AssignCleanerModal from "./assign-cleaner-modal"
import { assignCleanerToTask, type Booking } from "../lib/services/bookingService"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/hooks/useReduxHooks"
import { createChatThread, setSelectedChat, fetchAllThreads } from "@/redux/features/chat/chatSlice"
import { RootState } from "@/redux/store"
import { AppDispatch } from "@/redux/store"

interface TaskListProps {
  activeTab: "pending" | "active" | "completed"
  searchQuery?: string
  allTasks?: Booking[]
  onTaskUpdate?: (updatedTask: Booking) => void
}

const normalizeStatus = (status: string | undefined): string => {
  if (!status) return ''
  return status.toLowerCase().replace('_', ' ').trim()
}

export default function TaskList({ activeTab, searchQuery = "", allTasks = [] }: TaskListProps) {
  const [tasks, setTasks] = useState<Booking[]>(allTasks)
  const [filteredTasks, setFilteredTasks] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(!allTasks.length)
  const [error, setError] = useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  })

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const chats = useAppSelector((state: RootState) => state.chat.chats || [])
  const token = useAppSelector((state: RootState) => state.auth.token)
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id)

  useEffect(() => {
    if (allTasks.length) {
      setTasks(allTasks)
      setIsLoading(false)
    }
  }, [allTasks])

  useEffect(() => {
    if (isLoading) return

    let filtered = [...tasks]

    // Filter by status
    filtered = filtered.filter((task) => {
      const status = normalizeStatus(task.status)
      
      switch (activeTab) {
        case "pending":
          return status === "pending"
        case "active":
          return status === "confirmed" || 
                 status === "not started" || 
                 status === "in progress"
        case "completed":
          return status === "completed"
        default:
          return true
      }
    })

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((task) => {
        const serviceType = task.serviceType?.toLowerCase() || ''
        const property = task.propertyId?.name?.toLowerCase() || ''
        const propertyManagerName = task.propertyManagerId?.fullName?.toLowerCase() || ''
        const date = task.date?.toLowerCase() || ''
        const time = `${task.startTime} - ${task.endTime}`.toLowerCase()
        const assignedToName = task.cleanerId?.fullName?.toLowerCase() || ''

        return (
          serviceType.includes(query) ||
          property.includes(query) ||
          propertyManagerName.includes(query) ||
          date.includes(query) ||
          time.includes(query) ||
          assignedToName.includes(query)
        )
      })
    }

    setFilteredTasks(filtered)
  }, [tasks, activeTab, searchQuery, isLoading])

  const handleConfirmBooking = (bookingId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentBookingId(bookingId)
    setIsAssignModalOpen(true)
  }

  const handleAssignCleaner = async (cleanerId: string) => {
    if (!currentBookingId || !token) return

    try {
      setIsAssignModalOpen(false)
      
      const response = await assignCleanerToTask(
        {
          bookingId: currentBookingId,
          cleanerId: cleanerId,
        },
        token,
      )

      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task._id === currentBookingId) {
            return {
              ...task,
              status: "Confirmed",
              cleanerId: response.data.cleanerId
            }
          }
          return task
        })
      )

      showNotification("Cleaner assigned successfully", "success")
    } catch (err: any) {
      showNotification(err.message || "Failed to assign cleaner", "error")
    }
  }

  const handleStartChat = async (task: Booking) => {
    if (!task.cleanerId?._id || !currentUserId || !token) {
      showNotification("Cannot start chat: Missing required information", "error")
      return
    }

    try {
      // Check for existing chat
      const existingChat = chats.find(chat => 
        chat.participants.includes(task.cleanerId._id) &&
        chat.participants.includes(currentUserId) &&
        chat.taskId === task._id
      )

      if (existingChat) {
        dispatch(setSelectedChat({
          chatId: existingChat.id,
          cleanerName: task.cleanerId.fullName || "Cleaner",
          cleanerAvatar: task.cleanerId.avatar || "",
        }))
        router.push("/cleaning-business/inbox")
        return
      }

      // Create new chat thread
      const response = await dispatch(createChatThread({
        participantIds: [currentUserId, task.cleanerId._id],
        taskId: task._id,
        token,
      })).unwrap()

      if (response?._id) {
        await dispatch(fetchAllThreads({ userId: currentUserId, token }))
        
        dispatch(setSelectedChat({
          chatId: response._id,
          cleanerName: task.cleanerId.fullName || "Cleaner",
          cleanerAvatar: task.cleanerId.avatar || "",
        }))
        
        router.push("/cleaning-business/inbox")
      }
    } catch (error) {
      console.error("Chat creation error:", error)
      showNotification("Failed to start chat", "error")
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true })
    setTimeout(() => {
      setNotification({ message: "", type: "success", visible: false })
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ClipboardX className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500 max-w-md">
          {searchQuery
            ? `No tasks matching "${searchQuery}" found in the ${activeTab} category.`
            : activeTab === "pending"
              ? "There are no pending tasks at the moment."
              : activeTab === "active"
                ? "There are no active tasks at the moment."
                : `There are no ${activeTab} tasks at the moment.`}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const property = task.propertyId?.name || "N/A"
          const propertyManagerName = task.propertyManagerId?.fullName || "N/A"
          const date = new Date(task.date).toLocaleDateString()
          const time = `${task.startTime} - ${task.endTime}`
          const status = task.status ? 
            task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("_", " ") : 
            "Unknown"

          return (
            <div key={task._id}>
              <Link 
                href={`/cleaning-business/tasks/${task._id}`}
                className="block"
              >
                <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Service Type</p>
                      <p className="font-medium">{task.serviceType || "N/A"}</p>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Property</p>
                      <p className="font-medium">{property}</p>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Property Manager</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {propertyManagerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium">{propertyManagerName}</p>
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-medium">{date}</p>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="font-medium">{time}</p>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-medium">${task.price || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-t">
                    {activeTab === "pending" ? (
                      <>
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                          <p className="text-xs text-gray-500">Status</p>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {status}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleConfirmBooking(task._id, e)}
                          className="px-4 py-2 bg-[#4C41C0] text-white rounded-md hover:bg-[#4C41C0] transition-colors"
                        >
                          Confirm Booking
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                          <p className="text-xs text-gray-500">Assigned to</p>
                          {task.cleanerId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {task.cleanerId.fullName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="font-medium">{task.cleanerId.fullName}</p>
                              {activeTab === "active" && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleStartChat(task)
                                  }}
                                  className="text-gray-500 hover:text-primary transition-colors"
                                  title="Message cleaner"
                                >
                                  <MessageSquare className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="font-medium">Not assigned</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">Status</p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              normalizeStatus(task.status) === 'confirmed' || 
                              normalizeStatus(task.status) === 'not started'
                                ? "bg-blue-100 text-blue-800"
                                : normalizeStatus(task.status) === 'in progress'
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      <AssignCleanerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignCleaner}
      />

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
    </>
  )
}