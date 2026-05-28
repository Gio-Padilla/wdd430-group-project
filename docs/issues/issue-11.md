# Issue 11 — Root Layout, Error & 404 Pages

**Suggested Branch:** `[YOUR-INITIALS]-issue-11-root-layout-error`


**Labels:** `feature`, `frontend` | **Priority:** 🔴 Critical | **Depends on:** Issues 05, 06, 09

## Checklist
- [ ] **Prerequisite:** Ensure Issues 05, 06, 09 are completed.
- [ ] Replace `src/app/layout.tsx`
- [ ] Create `src/app/error.tsx`
- [ ] Create `src/app/not-found.tsx`

## Files to Create

### File 1 — `src/app/layout.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	sx
import { Aladin, Quicksand, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from "@/components/providers/CartProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const displayFont = Aladin({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-family",
});

const bodyFont = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-family",
});

const uiFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ui-family",
});

export const metadata = {
  title: {
    default: "Handcrafted Haven - Artisan Marketplace",
    template: "%s | Handcrafted Haven",
  },
  description:
    "Discover unique handmade products from talented artisans. Handcrafted Haven connects creators with customers who value sustainable, one-of-a-kind goods.",
  keywords: [
    "handmade",
    "artisan",
    "marketplace",
    "handcrafted",
    "sustainable",
    "unique",
    "pottery",
    "jewelry",
    "woodwork",
  ],
  authors: [{ name: "Handcrafted Haven" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Handcrafted Haven",
    title: "Handcrafted Haven - Artisan Marketplace",
    description:
      "Discover unique handmade products from talented artisans worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${uiFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-text font-body antialiased">
        <SessionProvider>
          <CartProvider>
            <ToastProvider>
              <a href="#main-content" className="skip-to-content">
                Skip to content
              </a>
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

### File 2 — `src/app/error.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> Copy the full 132-line file from the reference repo: `src/app/error.tsx`

Key implementation:
- `'use client'` directive
- Detects database errors vs generic runtime errors by checking error message/stack/name for prisma/database/connection keywords
- Database error UI: blue accent, `Database` icon, "Service Offline" badge
- Generic error UI: orange accent, `AlertTriangle` icon, "Application Error" badge
- "Try Again" button calls `reset()`, "Go Home" button does `window.location.href = '/'`

---

### File 3 — `src/app/not-found.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	sx
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <p className="font-display text-8xl text-cta mb-4">404</p>
        <h1 className="font-display text-3xl text-primary uppercase mb-3">Page Not Found</h1>
        <p className="font-body text-text-muted mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-6 py-3 rounded-full transition-colors"><Home size={18} /> Go Home</Link>
          <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-body font-semibold px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"><Search size={18} /> Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
```
