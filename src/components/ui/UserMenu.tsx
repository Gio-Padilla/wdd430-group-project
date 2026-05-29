"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSeller = user?.role === "seller";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border-2 border-black bg-white pl-1 pr-3 py-1 text-sm font-bold text-[#2F4F4F] transition hover:bg-gray-50 hover:shadow-md"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F26419] text-white text-xs font-bold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span>{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="flex flex-col">
            <Link
              href={isSeller ? "/dashboard" : "/account"}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#2F4F4F] hover:bg-gray-100 transition"
            >
              {isSeller ? <LayoutDashboard size={16} /> : <UserIcon size={16} />}
              {isSeller ? "Dashboard" : "My Account"}
            </Link>
            <div className="border-t border-black/10"></div>
            <button
              onClick={async () => {
                setIsOpen(false);
                await logoutAction();
              }}
              className="flex items-center w-full text-left gap-2 px-4 py-3 text-sm font-bold text-red-600 hover:bg-gray-100 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
