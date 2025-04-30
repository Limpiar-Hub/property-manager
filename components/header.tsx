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

// Header component for user navigation and logout
export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Generate initials from user's full name
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    const firstInitial = names[0]?.[0] || "";
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header
      className="border-b py-3 px-4 md:px-6 flex items-center justify-end"
      style={{
        backgroundColor: "var(--background-color, #ffffff)",
        color: "var(--text-color, #1a202c)",
        borderBottomColor: "rgba(0,0,0,0.1)",
      }}
    >
      {/* Notification Bell */}
      <button
        className="relative p-2 mr-4"
        style={{ color: "var(--text-color, #1a202c)" }}
      >
        <Bell className="h-5 w-5" />
      </button>

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center space-x-3"
            style={{ color: "var(--text-color, #1a202c)" }}
          >
            <Avatar className="h-8 w-8 border border-gray-300">
              <AvatarFallback
                style={{
                  backgroundColor: "#cce4ff",
                  color: "#003366",
                }}
              >
                {user?.fullName ? getInitials(user.fullName) : "NA"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block font-medium">
              {user?.fullName || "Guest"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          style={{
            backgroundColor: "var(--background-color, #ffffff)",
            color: "var(--text-color, #1a202c)",
            border: "1px solid rgba(0,0,0,0.1)",
            opacity: 1,
            minWidth: "200px",
            padding: "8px 0",
            zIndex: 50,
            animation: "scrollDown 0.4s ease-in-out",
          }}
        >
          {/* Scroll Down Animation Keyframes */}
          <style>
            {`
              @keyframes scrollDown {
                from {
                  transform: translateY(-100%) scaleY(0.9);
                  opacity: 0;
                }
                to {
                  transform: translateY(0) scaleY(1);
                  opacity: 1;
                }
              }
            `}
          </style>
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "var(--background-color, #ffffff)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--hover-background, #f7fafc)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-color, #ffffff)";
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "var(--background-color, #ffffff)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--hover-background, #f7fafc)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-color, #ffffff)";
            }}
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "var(--background-color, #ffffff)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--hover-background, #f7fafc)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-color, #ffffff)";
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}