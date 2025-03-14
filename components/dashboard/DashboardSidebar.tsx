"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  ClipboardList,
  Activity,
  Calendar,
  HeadphonesIcon,
  LogOut,
} from "lucide-react";
// import { Logo } from "@/components/ui/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="fixed inset-y-0 left-0 w-64 border-r border-gray-200">
      <SidebarHeader className="h-24 flex">
        <Image
          src="/authLogo.png"
          alt="logo"
          width={150}
          height={60}
          className="object-contain"
        />
      </SidebarHeader>

      <SidebarContent className="flex flex-col flex-grow p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/support"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <HeadphonesIcon className="h-5 w-5" />
                <span>Help and Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/logout"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
