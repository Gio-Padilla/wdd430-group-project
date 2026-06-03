"use client"

import { Search } from "lucide-react"

type Props = {
    searchTerm: string
    onSearchChange: (value: string) => void

    minPrice: number
    maxPrice: number

    onMinPriceChange: (value: number) => void
    onMaxPriceChange: (value: number) => void
}

export default function ProductFilters({
    searchTerm,
    onSearchChange,

    minPrice,
    maxPrice,

    onMinPriceChange,
    onMaxPriceChange,
}: Props) {

    return (

        <div className="bg-[#DCDCDC] border-2 border-[#000000] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] p-5 mb-10 flex flex-col lg:flex-row gap-4 lg:items-center">

            <div className="flex items-center flex-1 border-2 border-[#2F4F4F] rounded-xl px-4 py-3 bg-white">

                <Search
                    size={20}
                    className="text-[#2176FF] mr-3"
                />

                <label
                    htmlFor="search"
                    className="sr-only"
                >
                    Search Products
                </label>

                <input
                    id="search"
                    type="text"
                    placeholder="Search handmade products..."
                    value={searchTerm}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    className="w-full outline-none text-[#2F4F4F] placeholder:text-gray-400"
                />

            </div>

            <div className="flex items-center border-2 border-[#2F4F4F] rounded-xl px-4 py-3 bg-white">

                <label
                    htmlFor="minPrice"
                    className="sr-only"
                >
                    Minimum Price
                </label>

                <span className="text-[#000000] font-semibold mr-2">
                    Min $
                </span>

                <input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) =>
                        onMinPriceChange(
                            e.target.value === ""
                                ? 0
                                : Number(e.target.value)
                        )
                    }
                    className="w-20 outline-none bg-transparent text-[#2F4F4F]"
                />

            </div>

            <div className="flex items-center border-2 border-[#2F4F4F] rounded-xl px-4 py-3 bg-white">

                <label
                    htmlFor="maxPrice"
                    className="sr-only"
                >
                    Maximum Price
                </label>

                <span className="text-[#000000] font-semibold mr-2">
                    Max $
                </span>

                <input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) =>
                        onMaxPriceChange(
                            e.target.value === ""
                                ? 0
                                : Number(e.target.value)
                        )
                    }
                    className="w-20 outline-none bg-transparent text-[#2F4F4F]"
                />

            </div>

        </div>
    )
}