import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative sm:sticky sm:top-0 z-50 border-b-2 border-black bg-[#DCDCDC]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

        {/* Logo and name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-idea-1.png"
            width={80}
            height={80}
            alt="Handcrafted Haven Logo"
            className="h-14 w-auto"
            priority
          />

          <div>
            <h1 className="text-2xl uppercase tracking-widest text-[#2F4F4F]">
              Handcrafted Haven
            </h1>

            <p className="hidden text-sm text-black/70 sm:block">
              Handmade Goods & Artisan Creations
            </p>
          </div>
        </Link>

        {/* The Navigation links */}
        <nav className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded px-3 py-1 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="rounded px-3 py-1 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
          >
            Products
          </Link>

          <Link
            href="/about"
            className="rounded px-3 py-1 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="rounded px-3 py-1 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
          >
            Contact
          </Link>
        </nav>

        {/* The account link */}
        <div className="flex justify-center md:justify-end">
          <Link
            href="/account"
            className="
              rounded-lg
              border-2
              border-black
              bg-[#2F4F4F]
              px-4
              py-2
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#F26419]
              hover:shadow-md
            "
          >
            Account
          </Link>
        </div>

      </div>
    </header>
  );
}