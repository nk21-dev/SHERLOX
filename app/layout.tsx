import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SHERLOX — The Archive of Global Mysteries",
  description:
    "Reconstructing historical enigmas and corporate upheavals into definitive, undeniable forensic dossiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} dark bg-black h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-red-950 selection:text-red-200">
        {children}
      </body>
    </html>
  );
}
