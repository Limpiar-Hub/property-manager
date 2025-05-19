import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Property Manager',
  description: 'Manage your properties efficiently',
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