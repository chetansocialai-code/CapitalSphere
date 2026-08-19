import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CapitalSphere Admin & Editorial CMS',
  description: 'CapitalSphere Super Admin Portal - System Health, Editorial CMS Desk, Provider Logs & Trading Kill Switch Control',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070A0F] text-[#F4F7FA] min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
