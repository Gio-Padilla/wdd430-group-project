"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartOff } from "lucide-react";

export default function RemoveFromFavoritesButton({
    favoriteId,
}: {
    favoriteId: number;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleRemove() {
        try {
            setLoading(true);

            const response = await fetch("/api/favorites", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ favoriteId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            router.refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to remove favorite"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            <HeartOff className="w-4 h-4" />
            {loading ? "Removing..." : "Remove"}
        </button>
    );
}
