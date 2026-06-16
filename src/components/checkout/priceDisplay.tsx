"use client"

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function DisplayPrice({ price }: { price: number }) {
  return (
    <div className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-lg">
      <span className="text-sm text-gray-500">Total</span>
      <span className="font-medium text-base">{formatPrice(price)}</span>
    </div>
  );
}