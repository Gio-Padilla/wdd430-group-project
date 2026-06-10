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
        <div className="relative w-full aspect-[4/3] max-h-80 bg-gray-50 flex flex-col group">
            {/* Main Image */}
            <div className="relative w-full h-full overflow-hidden flex-1">
                <Image
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500"
                    priority={currentIndex === 0}
                />
            </div>

            {/* Navigation Arrows (Only show if multiple images) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-700 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-700 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots indicator at bottom */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex ? "bg-white scale-125 shadow-sm" : "bg-white/50 hover:bg-white/80"
                                }`}
                                aria-label={`Go to image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
