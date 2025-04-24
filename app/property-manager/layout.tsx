import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";
import { ImageProvider } from "@/components/imageFileProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Limpiar Property Manager",
  description: "Property Management System - Property Manager Dashboard",
  generator: "Next.js",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function PropertyManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ImageProvider>
        <Providers>{children}</Providers>
      </ImageProvider>
    </div>
  );
}
