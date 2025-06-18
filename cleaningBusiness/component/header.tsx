// "use client"

// // import { useSidebar } from "@/context/sidebar-context"
// import { Bell, Menu } from "lucide-react"

// export default function Header() {
// //   const { setIsMobileOpen } = useSidebar()

//   return (
//     <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
//       {/* Mobile menu toggle */}
//       {/* <button className="md:hidden" onClick={() => setIsMobileOpen(true)}>
//         <Menu className="h-6 w-6 text-gray-700" />
//       </button> */}

//       <div className="flex items-center space-x-4 ml-auto">
//         <div className="text-gray-700">00.00</div>
//         <div className="relative">
//           <Bell className="w-5 h-5 text-gray-700" />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             1
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium">William Scott</span>
//           <button className="flex items-center">
//             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M5 7.5L10 12.5L15 7.5"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </header>
//   )
// }


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
    router.push("/cleaning-business/login"); // Redirect to login page after logout
  };

    const handleProfile = () => {
    router.push("/cleaning-business/profile");
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
          <DropdownMenuItem  onClick={handleProfile}>Profile</DropdownMenuItem>
          {/* <DropdownMenuItem >Settings</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
