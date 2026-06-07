"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

type Category = {
    id: number;
    name: string;
};

type FilterBarProps = {
    categories: Category[];
};



export default function FilterBar({
    categories,
}: FilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    );

    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || ""
    );

    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || ""
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            if (category) params.set("category", category);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);

            startTransition(() => {
                router.replace(`/products?${params.toString()}`);
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [category, minPrice, maxPrice, router]);

    const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");

    router.replace("/products");
};

    return (
        <div
            className="
                mt-4
                mb-8
                p-6
                rounded-xl
                border-2
                shadow-lg
                flex
                flex-wrap
                gap-6
                items-end
            "
            style={{
                backgroundColor: "#2F4F4F",
                borderColor: "#000000",
            }}
        >
            {/* Category */}
            <div className="flex flex-col min-w-[220px]">
                <label
                    className="
                        mb-2
                        text-sm
                        uppercase
                        tracking-wider
                        font-bold
                    "
                    style={{
                        color: "#ffffff",
                        fontFamily: "Roboto",
                    }}
                >
                    Category
                </label>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="
                        p-3
                        rounded-lg
                        border-2
                        outline-none
                        transition-all
                    "
                    style={{
                        backgroundColor: "#DCDCDC",
                        borderColor: "#2176FF",
                        color: "#000000",
                        fontFamily: "Quicksand",
                    }}
                >
                    <option value="">All Categories</option>

                    {categories.map((cat) => (
                        <option
                            key={cat.id}
                            value={cat.id}
                        >
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Min Price */}
            <div className="flex flex-col min-w-[160px]">
                <label
                    className="
                        mb-2
                        text-sm
                        uppercase
                        tracking-wider
                        font-bold
                    "
                    style={{
                        color: "#ffffff",
                        fontFamily: "Roboto",
                    }}
                >
                    Minimum Price
                </label>

                <input
                    type="number"
                    placeholder="$0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="
                        p-3
                        rounded-lg
                        border-2
                        outline-none
                    "
                    style={{
                        backgroundColor: "#DCDCDC",
                        borderColor: "#2176FF",
                        color: "#000000",
                        fontFamily: "Quicksand",
                    }}
                />
            </div>

            {/* Max Price */}
            <div className="flex flex-col min-w-[160px]">
                <label
                    className="
                        mb-2
                        text-sm
                        uppercase
                        tracking-wider
                        font-bold
                    "
                    style={{
                        color: "#ffffff",
                        fontFamily: "Roboto",
                    }}
                >
                    Maximum Price
                </label>

                <input
                    type="number"
                    placeholder="$999"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="
                        p-3
                        rounded-lg
                        border-2
                        outline-none
                    "
                    style={{
                        backgroundColor: "#DCDCDC",
                        borderColor: "#2176FF",
                        color: "#000000",
                        fontFamily: "Quicksand",
                    }}
                />
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={clearFilters}
                className="
                    p-3
                    rounded-lg
                    border-2
                    cursor-pointer
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    bg-[#DCDCDC]
                    border-black
                    text-[#2F4F4F]

                    hover:bg-[#F26419]
                    hover:text-white
                    hover:shadow-md
                    hover:scale-105
                "
                style={{
                    fontFamily: "Roboto",
                }}
            >
                Clear Filters
            </button>

            {/* Status */}
            <div className="flex items-center h-full">
                {isPending && (
                    <div
                        className="
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                        "
                        style={{
                            backgroundColor: "#F26419",
                            color: "#FFFFFF",
                            fontFamily: "Roboto",
                        }}
                    >
                        Updating...
                    </div>
                )}
            </div>
        </div>
    );
}