import type { Metadata } from "next";
import { ToastProvider } from "@/context/ToastContext";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEZZY Enterprises | ERP Command Center",
  description: "Internal Business Operations & Billing for JEZZY Enterprises",
};

import { ConfirmDialog } from "@/ui/core/ConfirmDialog";
import { LoadingBar } from "@/ui/core/LoadingBar";
import { NetworkActivityIndicator } from "@/ui/core/NetworkActivityIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased selection:bg-primary-100 selection:text-primary-900"
      >
        <ToastProvider>
          <TransitionProvider>
            <LoadingBar />
            {children}
            <ConfirmDialog />
            <NetworkActivityIndicator />
          </TransitionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
