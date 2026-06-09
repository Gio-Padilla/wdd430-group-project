"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveFromCartButton({
    cartItemId,
}: {
    cartItemId: number;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleRemove() {

        if (
            !confirm(
                "Are you sure you want to remove this item?"
            )
        ) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "/api/cart",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        cartItemId,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error
                );
            }

            router.refresh();

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to remove item"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="
        bg-[#F26419]
        hover:bg-[#d95412]
        text-white
        px-4
        py-2
        rounded-lg
        border-2
        border-black
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
    "
        >
            {loading
                ? "Removing..."
                : "Remove"}
        </button>
    );
}