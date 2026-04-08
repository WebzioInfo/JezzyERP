import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JEZZY Enterprises | ERP Command Center",
  description: "Internal Business Operations & Billing for JEZZY Enterprises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased selection:bg-primary-100 selection:text-primary-900`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
