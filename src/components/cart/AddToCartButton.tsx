"use client";

import { useState } from "react";

export default function AddToCartButton({
    productId,
}: {
    productId: number;
}) {
    const [loading, setLoading] = useState(false);

    async function handleAddToCart() {
        try {
            setLoading(true);

            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            alert("Product added to cart!");
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Error adding product"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full bg-[#2F4F4F] hover:bg-[#F26419] text-white px-6 py-3 rounded-lg transition-colors"
        >
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
}