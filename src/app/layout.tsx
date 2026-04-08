import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F&P Civil — Project Hub",
  description: "Project management dashboard for F&P Civil",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        {/* Main content area — offset for sidebar on desktop, for header on mobile */}
        <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
