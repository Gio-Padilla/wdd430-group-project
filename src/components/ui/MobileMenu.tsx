"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, Home, ShoppingBag, Info, Phone, ShoppingCart } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface NavLink {
  name: string;
  href: string;
}

export default function MobileMenu({ navLinks, user }: { navLinks: NavLink[], user?: { name?: string | null, email?: string | null, role?: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to map link names to icons
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "home": return <Home size={18} className={pathname === "/" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      case "products": return <ShoppingBag size={18} className={pathname === "/products" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      case "about": return <Info size={18} className={pathname === "/about" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      case "contact": return <Phone size={18} className={pathname === "/contact" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      case "cart": return <ShoppingCart size={18} className={pathname === "/cart" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      case "sellers": return <User size={18} className={pathname === "/sellers" ? "text-[#F26419]" : "text-[#2F4F4F]/70"} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="md:hidden text-[#2F4F4F] focus:outline-none p-1 cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu className="h-7 w-7" />
      </button>

      {/* Portal for Backdrop and Drawer */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          {isOpen && (
            <div 
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div 
            className={`fixed inset-y-0 right-0 z-[70] w-[75vw] max-w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-bold text-[#2F4F4F] tracking-wider text-sm uppercase">MENU</span>
              <button onClick={() => setIsOpen(false)} className="text-[#2F4F4F] p-1 hover:bg-gray-100 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Block */}
            {user && (
              <div className="bg-white px-5 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2F4F4F] text-white text-xl font-bold shadow-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-[#2F4F4F] text-[15px] truncate">{user.name}</span>
                  <span className="text-[13px] text-gray-500 truncate">{user.email || ""}</span>
                </div>
              </div>
            )}

            {/* Scrollable Links Area */}
            <div className="flex-1 overflow-y-auto py-2">
              <nav className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-6 py-3.5 transition ${
                        isActive ? "text-[#F26419] bg-[#F26419]/5 font-semibold border-r-4 border-[#F26419]" : "text-[#2F4F4F] hover:bg-gray-50"
                      }`}
                    >
                      {getIcon(link.name)}
                      <span className="text-[15px]">{link.name}</span>
                    </Link>
                  );
                })}
                
                <div className="my-2 border-t border-gray-100 mx-5"></div>

                {user ? (
                  <Link
                    href={(user as any).role === "seller" ? "/dashboard" : "/account"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3.5 px-6 py-3.5 text-[#2F4F4F] hover:bg-gray-50 transition"
                  >
                    {(user as any).role === "seller" ? <LayoutDashboard size={18} className="text-[#2F4F4F]/70" /> : <User size={18} className="text-[#2F4F4F]/70" />}
                    <span className="text-[15px]">{(user as any).role === "seller" ? "Dashboard" : "My Account"}</span>
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3.5 px-6 py-3.5 text-[#2F4F4F] hover:bg-gray-50 transition"
                  >
                    <User size={18} className="text-[#2F4F4F]/70" />
                    <span className="text-[15px]">Sign In / Register</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Footer Action */}
            {user && (
              <div className="border-t border-gray-100 p-2 pb-5">
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await logoutAction();
                  }}
                  className="flex items-center gap-3.5 w-full px-4 py-3 text-[#F26419] hover:bg-[#F26419]/5 rounded-lg transition"
                >
                  <LogOut size={18} className="text-[#F26419]/80" />
                  <span className="text-[15px]">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}