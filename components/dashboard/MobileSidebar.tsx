"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Building2, ClipboardList, Activity, Calendar, HeadphonesIcon, LogOut } from "lucide-react"
// import { Logo } from "@/components/ui/logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    title: "Property",
    icon: Building2,
    href: "/dashboard/property",
  },
  {
    title: "New Orders",
    icon: ClipboardList,
    href: "/dashboard/orders",
  },
  {
    title: "Activities",
    icon: Activity,
    href: "/dashboard/activities",
  },
  {
    title: "Bookings",
    icon: Calendar,
    href: "/dashboard/bookings",
  },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { openMobile, setOpenMobile } = useSidebar()

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b border-gray-200 p-4">
          <SheetTitle>
            {/* <Logo /> */}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    pathname === item.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setOpenMobile(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4">
            <nav className="space-y-1">
              <Link
                href="/dashboard/support"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setOpenMobile(false)}
              >
                <HeadphonesIcon className="h-5 w-5" />
                <span>Help and Support</span>
              </Link>
              <Link
                href="/logout"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setOpenMobile(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

