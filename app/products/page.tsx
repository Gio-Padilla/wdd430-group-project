"use client"

import { useState } from "react"

import ProductCard from "@/components/ProductCard"
import ProductFilters from "@/components/ProductFilters"

import { products } from "@/data/products"

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

            <section className="bg-gray-100 rounded-3xl p-10 mb-10 text-center">

                <h1 className="text-5xl font-bold mb-4">
                    Handmade Products
                </h1>

                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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

            {filteredProducts.length === 0 && (
                <p className="text-gray-500 text-lg mt-8">
                    No products found.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}

            </div>

        </main>
    )
}