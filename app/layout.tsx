import type { Metadata } from "next";
import { Aladin, Quicksand, Roboto } from "next/font/google";

import "./globals.css";

import Header from "@/components/base/header";
import Footer from "@/components/base/footer";

const aladin = Aladin({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-small",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Handmade Goods & Artisan Creations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
       className={`
        ${aladin.variable}
        ${quicksand.variable}
        ${roboto.variable}
        h-full
        antialiased
      `}
    >
      <body className="flex min-h-screen flex-col bg-[#DCDCDC] text-[#000000]">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}