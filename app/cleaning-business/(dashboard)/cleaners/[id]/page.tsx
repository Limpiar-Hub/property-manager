"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import DashboardLayout from "../../layout"


const cleanerData = {
  id: 1,
  name: "Jerome Bell",
  title: "Cleaner",
  image: "/placeholder.svg",
  phone: "(270) 555-0117",
  email: "jerome.bell@example.com",
  address: "3517 W. Gray St. Utica, Pennsylvania 57867",
  tasks: [
    {
      id: 1,
      serviceType: "Janitorial Service",
      property: "Azure Haven",
      propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
      date: "12 Feb '25, Sat",
      time: "7:30 AM - 9:30 AM",
      notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
      status: "In Progress",
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
    },
    {
      id: 3,
      serviceType: "Janitorial Service",
      property: "Azure Haven",
      propertyManager: { name: "Cody Fisher", image: "/placeholder.svg" },
      date: "12 Feb '25, Sat",
      time: "7:30 AM - 9:30 AM",
      notes: "Physical space is often conceived in three linear dimensions, although modern physicists usually con",
      status: "In Progress",
    },
  ],
}

export default function CleanerDetail() {
  const [activeTaskType, setActiveTaskType] = useState<"active" | "completed">("active")

  return (
    <div>
      <Link href="/cleaning-business/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      {/* Cleaner Profile */}
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src="/jerome.png"
            alt={cleanerData.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{cleanerData.name}</h1>
          <p className="text-gray-500">{cleanerData.title}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-400" />
          <span>{cleanerData.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-400" />
          <span>{cleanerData.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span>{cleanerData.address}</span>
        </div>
      </div>

      <hr className="my-6" />

      {/* Task Tabs */}
      <div className="flex space-x-4 mb-6">
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

      {/* Task List */}
      <div className="space-y-4">
        {cleanerData.tasks.map((task) => (
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
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={cleanerData.image || "/placeholder.svg"}
                      alt={cleanerData.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="font-medium">{cleanerData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Status</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
