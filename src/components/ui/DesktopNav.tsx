"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  subLinks?: { name: string; href: string }[];
}

export default function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-wrap justify-center gap-2 lg:gap-4 items-center">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || (link.subLinks && link.subLinks.some(s => pathname === s.href));
        
        if (link.subLinks) {
          return (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className={`flex items-center gap-1 rounded px-3 py-1 font-semibold transition ${
                  isActive ? "text-[#F26419] bg-[#F26419]/5" : "text-[#2F4F4F] hover:bg-[#F26419] hover:text-white"
                }`}
              >
                {link.name}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>
              
              {/* Dropdown Menu */}
              {/* Hidden initially, becomes visible on group hover. Uses a small invisible bridge padding above to maintain hover. */}
              <div className="absolute left-0 top-[100%] pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col overflow-hidden">
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      className={`px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 ${
                        pathname === subLink.href ? "text-[#F26419] bg-[#F26419]/5" : "text-[#2F4F4F]"
                      }`}
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`rounded px-3 py-1 font-semibold transition ${
              isActive ? "text-[#F26419] bg-[#F26419]/5" : "text-[#2F4F4F] hover:bg-[#F26419] hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
