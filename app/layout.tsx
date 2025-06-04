import './globals.css';
import { ReactNode } from 'react';
import { Providers } from "@/redux/provider";

export const metadata = {
  title: 'Limpiar Cleaning Business Platform',
  description: 'Manage your cleaning businesses efficiently with Limpiar',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
