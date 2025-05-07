"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building,
  MessageCircle,
  Activity,
  Calendar,
  CreditCard,
  Headphones,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useReduxHooks"

import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/auth/authSlice";

const navItems = [
  { name: "Dashboard", href: "/cleaning-business/dashboard", icon: Building },
  { name: "Tasks", href: "/cleaning-business/tasks", icon: MessageCircle },
  { name: "Cleaners", href: "/cleaning-business/cleaners", icon: Activity },
  { name: "Inbox", href: "/cleaning-business/inbox", icon: Calendar },
  { name: "Payment", href: "/cleaning-business/payment", icon: CreditCard },
  // { name: "Property Metric", href: "/property-metrics", icon: FileText },
  // { name: "Listing", href: "/property-list", icon: CreditCard },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();


  const dispatch = useAppDispatch();
  const router = useRouter();
 

  const handleLogout = () => {
    dispatch(logout());
    router.push('/property-manager/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-50 bottom-4 right-4 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#101113] text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 ">
          <Image
            src="/cleaningBusinessLogo.png"
            alt="Limpiar Logo"
            width={120}
            height={50}
            className="h-10 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-700",
                  pathname === item.href ? "bg-gray-700" : ""
                )}
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-300" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom links */}
        <div className="absolute bottom-0 w-full border-t border-gray-700">
          <Link
            href="/support"
            className="group flex items-center px-4 py-3 text-sm font-medium hover:bg-gray-700"
          >
            <Headphones className="mr-3 h-5 w-5 text-gray-300" />
            Help and Support
          </Link>
          <div
             onClick={handleLogout}
            className="group flex items-center px-4 py-3 text-sm font-medium hover:bg-gray-700"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-300" />
            Logout
          </div>


  
        </div>
      </div>
    </>
  );
}
