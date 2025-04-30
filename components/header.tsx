"use client";

import { Bell, ChevronDown, Sparkles, CheckCircle, MapPin, LayoutDashboard, Video, Calendar, Users, Smartphone, Leaf, Home } from "lucide-react";
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

  // News updates for Limpiar with icons
  const newsUpdates = [
    { text: "Limpiar launches AI-powered property matching tool!", icon: <Sparkles /> },
    { text: "Instant property verification now live.", icon: <CheckCircle /> },
    { text: "Limpiar expands to 10 new cities in 2025.", icon: <MapPin /> },
    { text: "New dashboard for easier property management.", icon: <LayoutDashboard /> },
    { text: "Virtual tours added to Limpiar listings.", icon: <Video /> },
    { text: "Join our real estate webinar next week!", icon: <Calendar /> },
    { text: "Limpiar partners with top realtors.", icon: <Users /> },
    { text: "Mobile app update enhances UX.", icon: <Smartphone /> },
    { text: "Eco-friendly listings gain traction.", icon: <Leaf /> },
    { text: "1 million properties listed on Limpiar!", icon: <Home /> },
  ];

  return (
    <header
      className="border-b py-3 px-4 md:px-6 flex items-center"
      style={{
        backgroundColor: "var(--background-color, #ffffff)",
        color: "var(--text-color, #1a202c)",
        borderBottomColor: "rgba(0,0,0,0.1)",
      }}
    >
      {/* News Ticker Container */}
      <div
        className="hidden sm:block relative overflow-hidden mr-4 flex-1"
        style={{
          backgroundColor: "var(--hover-background, #f7fafc)",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "8px 12px",
          maxWidth: "calc(100% - 200px)",
          height: "32px",
        }}
      >
        <div
          className="news-ticker"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            position: "absolute",
            left: 0,
            top: 0,
            willChange: "transform",
          }}
        >
          {newsUpdates.map((update, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "var(--text-color, #1a202c)",
                fontWeight: 500,
                marginRight: "16px",
                flexShrink: 0,
                lineHeight: "16px",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "14px",
                  height: "14px",
                  marginRight: "8px",
                }}
              >
                {update.icon}
              </span>
              {update.text}
            </div>
          ))}
          {newsUpdates.map((update, index) => (
            <div
              key={`duplicate-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "var(--text-color, #1a202c)",
                fontWeight: 500,
                marginRight: "16px",
                flexShrink: 0,
                lineHeight: "16px",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "14px",
                  height: "14px",
                  marginRight: "8px",
                }}
              >
                {update.icon}
              </span>
              {update.text}
            </div>
          ))}
        </div>
        {/* Ticker Animation Keyframes */}
        <style jsx>{`
          .news-ticker {
            animation: ticker 40s linear infinite;
          }
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      {/* Right Side Container (Bell + Dropdown) */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="relative p-2"
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
            <style jsx>{`
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
            `}</style>
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
      </div>
    </header>
  );
}