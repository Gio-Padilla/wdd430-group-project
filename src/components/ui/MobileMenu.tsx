"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

export default function MobileMenu({ navLinks }: { navLinks: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="md:hidden text-[#2F4F4F] focus:outline-none p-1 cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#DCDCDC] border-b-2 border-black px-6 py-4 flex flex-col gap-4 md:hidden z-40 shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded px-3 py-2 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-black/10 pt-4 flex">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="w-full text-center rounded-lg border-2 border-black bg-[#2F4F4F] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F26419]"
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
}