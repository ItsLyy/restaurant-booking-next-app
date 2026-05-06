import { DM_Sans, Playfair_Display } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "RES.BOOK",
  description: "A book system for restaurants in your area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} h-full text-c-body antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
