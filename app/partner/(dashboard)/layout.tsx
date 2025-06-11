"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { checkTokenExpiration } from "@/redux/features/auth/authSlice";
import Sidebar from "@/cleaningBusiness/component/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (token) {
      dispatch(checkTokenExpiration());
    }

    if (!isAuthenticated) {
      router.push("/partner/login");
    }
  }, [isAuthenticated, token, dispatch, router]); 

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}