import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Limpiar Cleaning Business Platform',
  description: 'Manage your cleaning businesses efficiently with Limpiar',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}