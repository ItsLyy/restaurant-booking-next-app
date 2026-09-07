import { DM_Sans, Playfair_Display } from "next/font/google";

import { SITE_URL } from "@libs";

import type { Metadata, Viewport } from "next";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RES.BOOK",
    template: "%s | RES.BOOK",
  },
  description:
    "Discover, compare, and book tables at the best restaurants in your area.",
  openGraph: {
    siteName: "RES.BOOK",
    type: "website",
    title: "RES.BOOK",
    description:
      "Discover, compare, and book tables at the best restaurants in your area.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RES.BOOK",
    description:
      "Discover, compare, and book tables at the best restaurants in your area.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ef",
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
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://randomuser.me" />
      <body className="min-h-svh flex flex-col">{children}</body>
    </html>
  );
}
