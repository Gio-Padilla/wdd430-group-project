'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="mt-16 border-t-2 border-black bg-[#2F4F4F] text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">

        {/* The brand name */}
        <div>
          <h2 className="text-3xl uppercase tracking-widest">
            Handcrafted Haven
          </h2>

          <p className="mt-4 text-sm text-white/70">
            Handmade goods crafted with care, creativity, and passion.
          </p>

          <p className="mt-4 text-sm text-[#F26419]">
            Small batch • Artisan made • Unique designs
          </p>
        </div>

        {/* Links to different pages */}
        <div>
          <h3 className="text-lg uppercase tracking-wider">
            Explore
          </h3>

          <div className="mt-4 flex flex-col gap-2 text-white/80">
            <Link className="hover:text-[#F26419]" href="/">Home</Link>
            <Link className="hover:text-[#F26419]" href="/products">Products</Link>
            <Link className="hover:text-[#F26419]" href="/about">About</Link>
            <Link className="hover:text-[#F26419]" href="/contact">Contact</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg uppercase tracking-wider">
            Stay Updated
          </h3>

          <p className="mt-4 text-sm text-white/70">
            Get updates on new handmade collections.
          </p>

          <form className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="rounded border-2 border-black px-3 py-2 text-white"
            />

            <button
              type="submit"
              className="rounded border-2 border-black bg-[#F26419] py-2 font-semibold text-white hover:bg-[#2176FF]"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="border-t border-white/20 py-4 text-center text-sm text-white/60">
        © 2026 Handcrafted Haven • All rights reserved
      </div>

    </footer>
  );
}