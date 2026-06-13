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
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' })
    const [isFullscreen, setIsFullscreen] = useState(false)

    if (!images || images.length === 0) {
        images = ["/products/placeholder.jpg"]
    }

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isFullscreen) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2.2)'
        })
    }

    const handleMouseEnter = () => {
        if (!isFullscreen) setIsZoomed(true)
    }
    
    const handleMouseLeave = () => {
        setIsZoomed(false)
        setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' })
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Main Image */}
            <div 
                className="relative w-full aspect-[4/3] max-h-[400px] bg-gray-50 rounded-xl overflow-hidden group border border-gray-100 shadow-sm cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    setIsFullscreen(true)
                    setIsZoomed(false)
                    setZoomStyle({ transform: 'scale(1)' })
                }}
            >
                <Image
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover ${isZoomed ? 'transition-none' : 'transition-transform duration-500'}`}
                    style={isZoomed ? zoomStyle : { transform: 'scale(1)', transformOrigin: 'center center' }}
                    priority={currentIndex === 0}
                />
                
                {/* Navigation Arrows (Only show if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-[#F26419] transition-all disabled:opacity-50 z-10 ${isZoomed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-[#F26419] transition-all disabled:opacity-50 z-10 ${isZoomed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
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

            {/* Fullscreen Lightbox */}
            {isFullscreen && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(false);
                        }}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 text-3xl leading-none z-[110]"
                        aria-label="Close fullscreen"
                    >
                        &times;
                    </button>
                    
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Fullscreen`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            priority
                        />
                        
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-0 p-4 text-white/70 hover:text-white transition-colors z-[110] cursor-pointer"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-10 h-10" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-0 p-4 text-white/70 hover:text-white transition-colors z-[110] cursor-pointer"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
