import type { Metadata } from "next";
import { Aladin, Quicksand, Roboto } from "next/font/google";

import "./globals.css";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import GlobalToast from "@/components/ui/GlobalToast";

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
  description: "Discover unique handmade products from talented artisans. Handcrafted Haven connects creators with customers who value sustainable, one-of-a-kind goods.",
  keywords: "handmade, artisan crafts, unique gifts, sustainable products, local makers, handcrafted haven",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
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
      <body suppressHydrationWarning className="flex min-h-screen flex-col bg-[#DCDCDC] text-[#000000]">
        <GlobalToast />
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}