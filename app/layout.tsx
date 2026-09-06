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
  title: {
    default: "RES.BOOK",
    template: "%s | RES.BOOK",
  },
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
      className={`${dmSans.variable} ${playfairDisplay.variable} font-dm-sans bg-base-100 h-full text-c-body antialiased`}
    >
      <body className="min-h-svh flex flex-col">{children}</body>
    </html>
  );
}
