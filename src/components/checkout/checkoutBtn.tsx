"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutBtn() {
  const router = useRouter();

  const toCheckout = () => {
    router.push('/checkout');
  };

  return (
    <button
      className="absolute right-10 top-10 flex items-center gap-2 bg-accent hover:bg-accent/80 active:scale-95 transition-all duration-150 px-4 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer z-20"
      onClick={toCheckout}
    >
      <ShoppingCart size={16} />
      Checkout
    </button>
  );
}