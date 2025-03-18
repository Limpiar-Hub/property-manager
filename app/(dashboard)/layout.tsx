import type { Metadata } from "next"
// import { Inter } from 'next/font/google'
// import "../globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Limpiar Property Management",
  description: "Manage your properties efficiently",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en">
      <body >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
