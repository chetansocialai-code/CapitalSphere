import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { MarketTicker } from '@/components/MarketTicker';
import { Footer } from '@/components/Footer';
import { ThemeToggleFloating } from '@/components/ThemeToggleFloating';

export const metadata: Metadata = {
  title: 'CapitalSphere — Markets. Money. Business. Intelligence.',
  description: 'Enterprise Financial Intelligence Platform. Live stock quotes, Nifty 50, Option Chains, Upstox market streaming & business news.',
  keywords: 'Stock Market,Sensex,Nifty 50,Option Chain,Upstox V3,Financial News,IPO,CapitalSphere',
  other: {
    'google-adsense-account': 'ca-pub-2416474909531167',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2416474909531167" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2416474909531167"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-[#070A0F] text-[#F4F7FA] min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <MarketTicker />
        <main className="flex-1 max-w-master w-full mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
        <ThemeToggleFloating />
      </body>
    </html>
  );
}
