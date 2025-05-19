

import type { Metadata } from "next";
// import "./globals.css";
import "./fonts.css";
import type React from "react";
import { Toaster } from "@/admin-component/ui/toaster";
import { ThemeProvider } from "@/admin-component/theme-provider";

export const metadata: Metadata = {
  title: "Limpiar Admin",
  description: "Property Management System - Admin Dashboard",
  generator: "Next.js",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </div>
  );
}