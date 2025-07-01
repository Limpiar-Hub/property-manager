import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { Providers } from "@/redux/provider";
import { ImageProvider } from "@/components/imageFileProvider";
import { ThemeProvider } from "@/components/theme-provider";


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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ImageProvider>
            <Providers>{children}</Providers>
          </ImageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
