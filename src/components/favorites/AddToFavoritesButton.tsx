"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function AddToFavoritesButton({
    productId,
    initialFavorited = false,
}: {
    productId: number;
    initialFavorited?: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [favorited, setFavorited] = useState(initialFavorited);

    async function handleToggleFavorite() {
        try {
            setLoading(true);

            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFavorited(data.action === "added");
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Error updating favorites"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`group inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                favorited
                    ? "bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-100 hover:border-red-300"
                    : "bg-[#2F4F4F] text-white border-2 border-transparent hover:bg-[#F26419] hover:shadow-lg hover:shadow-[#F26419]/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <Heart
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    favorited ? "fill-red-500 text-red-500" : "fill-none"
                }`}
            />
            {loading
                ? "Saving..."
                : favorited
                ? "Favorited"
                : "Add to Favorites"}
        </button>
    );
}
