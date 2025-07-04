"use client";

import { Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the authenticated user's name from Redux state
  const { user } = useAppSelector((state) => state.auth);

  // Extract initials from the user's name
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    const firstInitial = names[0]?.[0] || "";
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/property-manager/login"); // Redirect to login page after logout
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-end">
      {/* Notification bell */}
      <button className="relative p-2 mr-4 text-gray-600 hover:text-gray-900">
        <Bell className="h-5 w-5" />
        {/* <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          1
        </span> */}
      </button>

      {/* User profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-3 hover:text-blue-600">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {user?.fullName ? getInitials(user.fullName) : "NA"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block font-medium">
              {user?.fullName || "Guest"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
