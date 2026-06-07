"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({
    productId,
}: {
    productId: string;
}) {
    const router = useRouter();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                }),
            });

            let data;

            try {
                data = await response.json();
            } catch {
                data = {
                    error: "Server returned an invalid response"
                };
            }

            console.log("API RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to submit review"
                );
            }

            alert("Review submitted successfully!");

            router.push(`/products/${productId}`);
            router.refresh();

        } catch (error) {
            console.error("SUBMIT ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Unknown error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div>
                <label
                    htmlFor="rating"
                    className="block font-medium mb-2 text-[#2F4F4F]"
                >
                    Rating
                </label>

                <select
                    id="rating"
                    value={rating}
                    onChange={(e) =>
                        setRating(Number(e.target.value))
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#F26419]"
                >
                    <option value={5}>★★★★★ (5)</option>
                    <option value={4}>★★★★☆ (4)</option>
                    <option value={3}>★★★☆☆ (3)</option>
                    <option value={2}>★★☆☆☆ (2)</option>
                    <option value={1}>★☆☆☆☆ (1)</option>
                </select>
            </div>

            <div>
                <label className="block font-medium mb-2">
                    Review
                </label>

                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                    rows={5}
                    required
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Tell other buyers about your experience..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                {loading
                    ? "Submitting..."
                    : "Submit Review"}
            </button>
        </form>
    );
}