import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import LegacyRedirect from "@/components/legacy_redirect/legacy_redirect";
import React from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "My Lif",
  description: "Manage Your Lif Account."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextTopLoader showSpinner={false} />
        <LegacyRedirect />
        {children}
      </body>
    </html>
  );
}
