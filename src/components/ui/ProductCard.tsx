"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { useState } from "react"

type Product = {
    id: number
    title: string
    description: string
    price: number
    image: string
    images?: string[]
    category?: string
    avg_rating?: number
    review_count?: number
}

export default function ProductCard({
    product,
    initialFavorited = false,
}: {
    product: Product
    initialFavorited?: boolean
}) {
    const [favorited, setFavorited] = useState(initialFavorited)
    const [loading, setLoading] = useState(false)

    const images = product.images && product.images.length > 0 ? product.images : [product.image]

    async function handleToggleFavorite(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            setFavorited(data.action === "added")
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Error updating favorites"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 relative">

                    {/* Image */}
                    <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                        <Image
                            src={images[0]}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                    {/* Category Badge */}
                    {product.category && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#2F4F4F] px-2 py-0.5 rounded-full shadow-sm">
                            {product.category}
                        </span>
                    )}

                    {/* Favorite Button */}
                    <button
                        onClick={handleToggleFavorite}
                        disabled={loading}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all cursor-pointer disabled:opacity-50 z-10"
                        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${
                                favorited
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400 hover:text-red-400"
                            }`}
                        />
                    </button>
                </div>

                {/* Info */}
                <div className="p-3">
                    <h2 className="font-semibold text-gray-900 group-hover:text-[#F26419] transition-colors line-clamp-1 text-sm">
                        {product.title}
                    </h2>

                    {/* Price + Rating */}
                    <div className="flex items-center justify-between mt-1.5">
                        <p className="text-sm font-bold text-[#2F4F4F]">
                            ${Number(product.price).toFixed(2)}
                        </p>

                        {product.avg_rating !== undefined && (
                            <div className="flex items-center gap-0.5 text-xs text-gray-500">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium text-gray-700">
                                    {Number(product.avg_rating).toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Link>
    )
}