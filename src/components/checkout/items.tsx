"use client"
import { useState } from "react"
import Item from "./item"
import DisplayPrice from "./priceDisplay"

export interface ItemsProps {
    id: number
    product_id: number
    title: string
    price: string
    description: string
    images: Array<string>
    image: string
    quantity: number;
    onQuantityChange: (qty: number) => void;
}

export default function Items({items, userId}: {items: Array<ItemsProps>, userId: number}) {

    const [quantities, setQuantities] = useState<Record<number, number>>(
        Object.fromEntries(items.map(item => [item.product_id, 1]))
    );

    const [prices, setPrices] = useState<Record<number, number>>(
        Object.fromEntries(items.map(item => [item.product_id, parseFloat(item.price)]))
    );

    const handleQuantityChange = (itemId:number, qty:number, unitPrice: number) => {
        setQuantities(prev => ({...prev, [itemId]: qty}))
        setPrices(prev => ({ ...prev, [itemId]: qty * unitPrice }));

    }
    const total = Object.values(prices).reduce((sum, price) => sum + price, 0); 

    const handleRequest = async () => {
        try{
            console.log('helo')

            const response = await fetch('/api/checkout', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId, quantities, total})
            })
        }catch(err) {
            console.error(err)
        }   
    }

    // console.log(quantities)
    // console.log(total)
    // console.log(userId)
    return(
        <div className="relative">
            <DisplayPrice price={total}/>
            <button className="cursor-pointer" onClick={() => handleRequest()}>Proceed</button>
            {items.map((item: ItemsProps, index: number) => 
            <div key={index}>
                <Item {...item} onQuantityChange={(qty) => handleQuantityChange(item.product_id, qty, parseFloat(item.price))}/>
            </div>)}
        </div>
    )
}