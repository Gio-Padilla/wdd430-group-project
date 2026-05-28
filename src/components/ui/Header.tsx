import Image from "next/image";
import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import MobileMenu from "@/components/ui/MobileMenu";
import UserMenu from "@/components/ui/UserMenu";
import DesktopNav from "@/components/ui/DesktopNav";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  const desktopNavLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { 
      name: "About", 
      href: "/about",
      subLinks: [
        { name: "Contact", href: "/contact" },
        { name: "Sellers", href: "/sellers" }
      ]
    },
  ];

  const mobileNavLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Sellers", href: "/sellers" },
    { name: "Cart", href: "/cart" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#DCDCDC]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-4 md:flex-row md:items-center md:justify-between relative">
        
        {/* Top Row: Logo & Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-idea-1.webp"
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

          {/* Pass mobile navigation links and user down to the Client Component */}
          <MobileMenu navLinks={mobileNavLinks} user={session?.user} />
        </div>

        {/* Desktop Navigation Links */}
        <DesktopNav navLinks={desktopNavLinks} />

        {/* Desktop Right: Cart & Account Button */}
        <div className="hidden md:flex items-center gap-4 justify-end">
          <Link href="/cart" className="relative p-2 text-[#2F4F4F] hover:text-[#F26419] transition" aria-label="Shopping Cart">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          {session ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/account?mode=login"
              className="rounded-lg border-2 border-black bg-[#2F4F4F] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#F26419] hover:shadow-md"
            >
              Account
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}