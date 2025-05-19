"use client"

// import { useSidebar } from "@/context/sidebar-context"
import { Bell, Menu } from "lucide-react"

export default function Header() {
//   const { setIsMobileOpen } = useSidebar()

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      {/* Mobile menu toggle */}
      {/* <button className="md:hidden" onClick={() => setIsMobileOpen(true)}>
        <Menu className="h-6 w-6 text-gray-700" />
      </button> */}

      <div className="flex items-center space-x-4 ml-auto">
        <div className="text-gray-700">00.00</div>
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">William Scott</span>
          <button className="flex items-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
