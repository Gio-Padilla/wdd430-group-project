"use client"

import { useState } from "react"

import ProductCard from "@/components/ProductCard"
import ProductFilters from "@/components/ProductFilters"
import { products } from "@/data/products"
import EmptyState from "@/components/ui/EmptyState"

export default function ProductsPage() {

    const [searchTerm, setSearchTerm] = useState("")

    const [minPrice, setMinPrice] = useState(0)

    const [maxPrice, setMaxPrice] = useState(1000)

    const filteredProducts = products.filter((product) => {

        const matchesPrice =
            product.price >= minPrice &&
            product.price <= maxPrice

        const matchesSearch =
            product.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            product.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

        return matchesPrice && matchesSearch
    })

    return (

        <main className="p-6 max-w-7xl mx-auto">

            <section className="bg-[#DCDCDC] border-2 border-[#000000] rounded-3xl p-10 mb-10 text-center shadow-[0_8px_25px_rgba(47,79,79,0.25)]">

                <h1 className="text-5xl font-bold mb-4 text-[#2F4F4F]">
                    Handmade Products
                </h1>

                <p className="text-[#2176FF] text-lg max-w-2xl mx-auto">
                    Discover unique artisan creations handcrafted with care.
                </p>

            </section>

            <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                minPrice={minPrice}
                maxPrice={maxPrice}

                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
            />

            {
                filteredProducts.length > 0 ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>

                ) : (

                    <EmptyState
                        title="No products found"
                        description="Try another search term or price range."
                    />

                )
            }
        </main>
    )
}