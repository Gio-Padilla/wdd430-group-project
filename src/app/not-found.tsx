import Link from 'next/link'

import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        
        <p className="font-display text-8xl text-orange-500 mb-4 animate-pulse">
          404
        </p>
        
        {/* Main Heading */}
        <h1 className="font-display text-3xl text-gray-800 uppercase mb-3 tracking-wide">
          Page Not Found
        </h1>
        
        {/* Descriptive Text tailored to Handicraft Haven */}
        <p className="font-body text-gray-500 mb-8 max-w-md mx-auto">
          The unique handcrafted piece you&apos;re looking for isn&apos;t here. It might have been moved, or the link is broken.
        </p>
        
        {/* Helpful Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-body font-semibold px-8 py-3 rounded-full transition-colors"
          >
            <Home size={18} /> Go Home
          </Link>
          
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-800 text-gray-800 font-body font-semibold px-8 py-3 rounded-full hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Search size={18} /> Browse Shop
          </Link>
        </div>

      </div>
    </div>
  );
}