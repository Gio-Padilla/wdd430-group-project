import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/ui/MobileMenu";

export default function Header() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#DCDCDC]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-4 md:flex-row md:items-center md:justify-between relative">
        
        {/* Top Row: Logo & Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
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
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#2F4F4F]">
                Handcrafted Haven
              </h1>
              <p className="hidden text-sm text-black/70 sm:block">
                Handmade Goods & Artisan Creations
              </p>
            </div>
          </Link>

          {/* Pass navigation links down to the Client Component */}
          <MobileMenu navLinks={navLinks} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-wrap justify-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded px-3 py-1 font-semibold text-[#2F4F4F] transition hover:bg-[#F26419] hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Account Button */}
        <div className="hidden md:flex justify-end">
          <Link
            href="/account"
            className="rounded-lg border-2 border-black bg-[#2F4F4F] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#F26419] hover:shadow-md"
          >
            Account
          </Link>
        </div>

      </div>
    </header>
  );
}