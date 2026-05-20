import Image from "next/image";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between px-6 py-8">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo-idea-1.png"
          width={1000}
          height={760}
          alt="Logo for Handcrafted Haven"
          className="h-auto max-w-xs"
        />
        <h1 className="text-3xl font-bold tracking-wide" >Handcrafted Haven</h1>
      </div>
        <nav className="flex flex-row gap-4 items-center">
          <Link href="" className="transition hover:text-gray-500">Home</Link>
          <Link href="" className="transition hover:text-gray-500">Products</Link>
          <Link href="" className="transition hover:text-gray-500">About</Link>
        </nav>
        <div>
          <Link href="" className="rounded-md border px-4 py-2 transition hover:bg-gray-100">Account</Link>
        </div>
    </header>
  );
}
