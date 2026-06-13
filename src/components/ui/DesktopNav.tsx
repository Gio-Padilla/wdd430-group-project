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
        
        let currentName = link.name;
        let currentHref = link.href;
        let currentSubLinks = link.subLinks ? [...link.subLinks] : undefined;

        let isActive = pathname === currentHref;

        if (currentSubLinks) {
          const activeSubIndex = currentSubLinks.findIndex(s => pathname === s.href);
          if (activeSubIndex !== -1) {
            const activeSub = currentSubLinks[activeSubIndex];
            currentName = activeSub.name;
            currentHref = activeSub.href;
            currentSubLinks[activeSubIndex] = { name: link.name, href: link.href };
            isActive = true;
          } else {
            // Also active if the main link is active
            isActive = pathname === currentHref;
          }
        }

        if (currentSubLinks) {
          return (
            <div key={link.name} className="relative group z-50">
              <Link
                href={currentHref}
                className={`flex items-center gap-1 rounded px-3 py-1 font-semibold transition ${
                  isActive ? "text-[#F26419] bg-[#F26419]/5" : "text-[#2F4F4F] hover:bg-[#F26419] hover:text-white"
                }`}
              >
                {currentName}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>
              
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col overflow-hidden">
                  {currentSubLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      className={`px-4 py-3 text-sm text-center font-semibold transition hover:bg-[#F26419] hover:text-white ${
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
            href={currentHref}
            className={`rounded px-3 py-1 font-semibold transition ${
              isActive ? "text-[#F26419] bg-[#F26419]/5" : "text-[#2F4F4F] hover:bg-[#F26419] hover:text-white"
            }`}
          >
            {currentName}
          </Link>
        );
      })}
    </nav>
  );
}
