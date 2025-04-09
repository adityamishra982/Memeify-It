import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Sidebar";
import SessionWrapper from './components/SessionWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memeify It",
  description: "Your Ultimate Hub for GIFs, Memes & Fun Content!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
        <Navbar/>
        <div className="w-full">
        {children}
        </div>
      </body>
        </SessionWrapper>
    </html>
  );
}
