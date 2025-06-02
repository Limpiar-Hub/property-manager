
"use client"

import { useState } from "react"
import CleanersTab from "@/cleaningBusiness/component/cleaners-tab"
import TasksTab from "@/cleaningBusiness/component/tasks-tab"


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"cleaners" | "tasks">("cleaners")
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="">
     <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="border-b mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("cleaners")}
                className={`pb-2 font-medium ${
                  activeTab === "cleaners" ? "text-[#4C41C0] border-b-2 border-[#4C41C0]" : "text-gray-500"
                }`}
              >
                Cleaners
              </button>
              {/* <button
                onClick={() => setActiveTab("tasks")}
                className={`pb-2 font-medium ${
                  activeTab === "tasks" ? "text-[#4C41C0] border-b-2 border-[#4C41C0]" : "text-gray-500"
                }`}
              >
                Tasks
              </button> */}
            </div>
          </div>

          {activeTab === "cleaners" ? <CleanersTab /> : <TasksTab />}
        </main>
    </div>
  )
}
