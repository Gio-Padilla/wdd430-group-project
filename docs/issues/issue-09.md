# Issue 09 — Header, MobileMenu & Footer

**Suggested Branch:** `[YOUR-INITIALS]-issue-09-header-mobilemenu-footer`


> **User Story:** As a mobile user, I want the website layout to adjust to my screen size so that I can browse and shop comfortably on my phone.
> **Acceptance Criteria:** Navigation menus must collapse into a "hamburger" style on small screens, and product grids must reflow without horizontal scrolling.


> **User Story:** As a user with visual impairments, I want the site navigation to be accessible via screen reader so that I can browse the marketplace independently.
> **Acceptance Criteria:** All interactive elements must have proper ARIA labels and follow WCAG 2.1 Level AA hierarchy.


**Labels:** `feature`, `frontend` | **Priority:** 🟡 High | **Depends on:** Issues 06, 07

## Checklist
- [ ] **Prerequisite:** Ensure Issues 06, 07 are completed.
- [ ] Create `src/components/ui/Header.tsx` (194 lines)
- [ ] Create `src/components/ui/MobileMenu.tsx` (213 lines)
- [ ] Create `src/components/ui/Footer.tsx` (143 lines)

> ⚠️ All three files must use the `'use client'` directive.

## Files to Create

### File 1 — `src/components/ui/Header.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> Sticky header with logo, desktop nav, cart badge, account dropdown, and mobile hamburger.

```	sx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white text-primary shadow-card" role="banner">
      <div className="container-app">
        <nav
          className="flex items-center justify-between h-16 md:h-18"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Image src="/logo-idea-haven.webp" alt="Handcrafted Haven" width={120} height={32} className="object-contain shrink-0 h-8 md:h-10 w-auto" priority />
            <span className="font-display text-xl md:text-2xl uppercase tracking-wider text-primary hidden sm:block">
              Handcrafted Haven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.label === 'About') {
                return (
                  <div key={link.href} className="relative group py-2">
                    <Link
                      href={link.href}
                      className={`font-body text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-cta after:transition-all hover:after:w-full ${ isActive ? "text-cta after:w-full" : "text-text-muted hover:text-cta after:w-0" }`}
                    >
                      {link.label}
                    </Link>
                    <div className="absolute left-0 top-full mt-0 hidden group-hover:block w-40 bg-white rounded-lg shadow-dropdown py-2 z-50 animate-fade-in-down">
                      <Link href="/sellers" className="block px-4 py-2 text-sm font-body text-text hover:bg-surface hover:text-cta transition-colors">
                        All Sellers
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-cta after:transition-all hover:after:w-full ${
                    isActive
                      ? "text-cta after:w-full"
                      : "text-text-muted hover:text-cta after:w-0"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user?.role === 'seller' ? (
              <Link
                href="/dashboard"
                className={`font-body text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-cta after:transition-all hover:after:w-full ${
                  pathname.startsWith('/dashboard')
                    ? "text-cta after:w-full"
                    : "text-text-muted hover:text-cta after:w-0"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sell"
                className={`font-body text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-cta after:transition-all hover:after:w-full ${
                  pathname.startsWith('/sell')
                    ? "text-cta after:w-full"
                    : "text-cta hover:text-cta-light after:w-0"
                }`}
              >
                Sell
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-primary/5 transition-colors"
              aria-label={`Shopping cart with ${count} items`}
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cta text-text text-xs font-ui font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  onBlur={() => setTimeout(() => setAccountMenuOpen(false), 200)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-primary/5 transition-colors"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover border-2 border-border-light"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cta flex items-center justify-center text-xs font-bold font-ui">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown size={14} className={`transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-dropdown py-2 animate-fade-in-down z-50">
                    <div className="px-4 py-2 border-b border-border-light">
                      <p className="font-body text-sm font-semibold text-text truncate">{user.name}</p>
                      <p className="font-ui text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-text hover:bg-surface transition-colors"
                    >
                      <User size={16} />
                      My Account
                    </Link>
                    {user.role === 'seller' && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-text hover:bg-surface transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-border-light" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-error w-full text-left hover:bg-error-light transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body text-sm font-semibold px-5 py-2 rounded-full transition-colors"
              >
                <User size={16} />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-primary/5 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </header>
  );
}
```

---

### File 2 — `src/components/ui/MobileMenu.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> Slide-in drawer from right, with overlay backdrop, Escape-to-close, focus trap, user info, all nav links, and sign in/out buttons.

Due to the size of this file (213 lines), please copy the exact code from the reference repo file: `src/components/ui/MobileMenu.tsx`

Key implementation details:
- `'use client'` directive
- Imports: `useEffect`, `useRef`, `Link`, `Image`, icons (`X`, `ShoppingCart`, `User`, `LogOut`, `LayoutDashboard`, `Store`), `useAuth`, `usePathname`, `useCart`
- Closes on Escape key, locks body scroll when open
- Focus trap (first focusable element gets focus)
- Overlay click to close
- Shows user avatar/name/email when logged in
- All navigation links with active state detection
- Cart link with badge count
- Sell/Dashboard link depending on user role
- Sign Out button (logged in) or Sign In/Create Account buttons (logged out)

---

### File 3 — `src/components/ui/Footer.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> Multi-column footer with brand, quick links, legal, contact info, social icons. Hidden on `/dashboard` routes.

Due to the size of this file (143 lines), please copy the exact code from the reference repo file: `src/components/ui/Footer.tsx`

Key implementation details:
- `'use client'` directive
- Returns `null` if `pathname.startsWith('/dashboard')`
- 5-column grid: Brand (logo + description), Quick Links, Legal, Contact (email/phone/address with icons), Follow (Instagram/Twitter/Facebook SVG icons)
- Bottom bar with copyright year using `new Date().getFullYear()`
- All links use `font-body text-sm text-white/80 hover:text-cta`
