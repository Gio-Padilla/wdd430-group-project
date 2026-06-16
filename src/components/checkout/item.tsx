"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ItemsProps } from './items';

export default function Item({ onQuantityChange, quantity, description, id, image, price, title }: ItemsProps) {
    const [initQuan, setQuan] = useState(1)

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <Image
        width={80}
        height={80}
        src={image}
        alt={description}
        className="rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{description}</p>
      </div>

      <span className="font-medium text-sm shrink-0">{price}</span>
      <div className='flex gap-5 text-xl'>
        <button onClick={() => {
            onQuantityChange(initQuan - 1)
            setQuan(initQuan - 1)} }>-</button>
        <p>{initQuan}</p>
        <button onClick={() => {
            onQuantityChange(initQuan + 1)
            setQuan(initQuan + 1)}}>+</button>
      </div>
        
    </div>
     
  );
}