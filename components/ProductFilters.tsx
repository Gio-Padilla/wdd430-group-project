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

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-10 flex flex-col lg:flex-row gap-4 lg:items-center">

            <div className="flex items-center flex-1 border rounded-xl px-4 py-3 bg-white">

                <Search
                    size={20}
                    className="text-gray-400 mr-3"
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
                    className="w-full outline-none"
                />

            </div>

            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">

                <label
                    htmlFor="minPrice"
                    className="sr-only"
                >
                    Minimum Price
                </label>

                <span className="text-gray-500 mr-2">
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
                    className="w-20 outline-none bg-transparent"
                />

            </div>

            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">

                <label
                    htmlFor="maxPrice"
                    className="sr-only"
                >
                    Maximum Price
                </label>

                <span className="text-gray-500 mr-2">
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
                    className="w-20 outline-none bg-transparent"
                />

            </div>

        </div>
    )
}