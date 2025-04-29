import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/redux/provider";
import { ImageProvider } from "@/components/imageFileProvider";
import { Inter, Roboto_Mono } from "next/font/google";
import ThemeProvider from "@/components/themeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ImageProvider>
          <Providers>
            <ThemeProvider>
            {children}
            </ThemeProvider>
            </Providers>
        </ImageProvider>
      </body>
    </html>
  );
}
