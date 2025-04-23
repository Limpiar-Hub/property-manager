import type { Metadata } from "next"
import "./globals.css"
import "./fonts.css"
import type React from "react"
import { Toaster } from "@/admin-component/ui/toaster"
import { ThemeProvider } from "@/admin-component/theme-provider"

export const metadata: Metadata = {
  title: "Limpiar Admin",
  description: "Property Management System - Admin Dashboard",
  generator: "Next.js",
  icons: {
    icon: "/favicon.ico", 
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />

      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

