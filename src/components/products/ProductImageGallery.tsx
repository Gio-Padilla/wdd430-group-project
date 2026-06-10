"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductImageGallery({
    images,
    title
}: {
    images: string[]
    title: string
}) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) {
        images = ["/products/placeholder.jpg"]
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] max-h-[400px] bg-gray-50 rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                <Image
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500"
                    priority={currentIndex === 0}
                />
                
                {/* Navigation Arrows (Only show if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-[#F26419] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-[#F26419] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Miniatures */}
            {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((src, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentIndex 
                                    ? "border-[#F26419] opacity-100 shadow-sm" 
                                    : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
