import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dead Cat Society",
  description: "Study Logs for the Terminally Curious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="relative flex flex-col min-h-screen bg-neutral-100">
          {children}
          <div className="fixed bottom-8 left-0 right-0 z-10 pointer-events-none">
            <div className="flex justify-center">
              <div className="pointer-events-auto">
                <Navbar />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
