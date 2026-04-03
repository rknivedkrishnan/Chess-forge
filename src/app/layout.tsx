import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OpeningForge | Modern Chess Opening Training",
  description: "Master your chess openings with minimal UI, spaced repetition, and deep personalization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-base-900 text-text-main antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
