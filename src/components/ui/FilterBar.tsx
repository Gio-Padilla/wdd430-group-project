"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { Search, FilterX, Star } from "lucide-react";

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

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");

    const [debouncedQ] = useDebounce(q, 500);
    const [debouncedMinPrice] = useDebounce(minPrice, 500);
    const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

    useEffect(() => {
        const params = new URLSearchParams();

        if (debouncedQ) params.set("q", debouncedQ);
        if (category) params.set("category", category);
        if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
        if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
        if (minRating) params.set("minRating", minRating);

        startTransition(() => {
            router.replace(`/products?${params.toString()}`);
        });
    }, [debouncedQ, category, debouncedMinPrice, debouncedMaxPrice, minRating, router]);

    const clearFilters = () => {
        setQ("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("");

        router.replace("/products");
    };

    return (
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 w-full transition-all">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
                {/* Search Bar */}
                <div className="relative flex-grow w-full">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                        Search
                    </label>
                    <div className="absolute bottom-0 left-0 pl-3 pb-2.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for handmade goods..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26419]/20 focus:border-[#F26419] transition-all text-sm"
                    />
                </div>

                {/* Filters Group */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto flex-shrink-0">
                    {/* Category */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#F26419]/20 focus:border-[#F26419] transition-all cursor-pointer text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Min Price */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Min Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">$</span>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#F26419]/20 focus:border-[#F26419] transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Max Price */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Max Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">$</span>
                            <input
                                type="number"
                                placeholder="999"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#F26419]/20 focus:border-[#F26419] transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Minimum Rating */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Min Rating
                        </label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <Star className="w-3.5 h-3.5" />
                            </span>
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#F26419]/20 focus:border-[#F26419] transition-all cursor-pointer appearance-none text-sm"
                            >
                                <option value="">Any Rating</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                                <option value="1">1+ Star</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-end">
                    <button
                        onClick={clearFilters}
                        className="h-[38px] px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium text-xs transition-colors border border-gray-200 cursor-pointer flex items-center justify-center whitespace-nowrap gap-1.5"
                    >
                        <FilterX className="w-3.5 h-3.5" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Updating Status */}
            {isPending && (
                <div className="absolute top-2 right-4 text-[10px] font-medium text-[#F26419] flex items-center gap-1.5 animate-pulse">
                    <span className="w-3 h-3 rounded-full border-2 border-[#F26419] border-t-transparent animate-spin"></span>
                    Updating...
                </div>
            )}
        </div>
    );
}