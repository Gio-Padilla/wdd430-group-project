import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import RemoveFromFavoritesButton from "@/components/favorites/RemoveFromFavoritesButton";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/account?error=favorites_login");
    }

    const userId = Number(session.user.id);

    const result = await db.query(
        `SELECT
            f.id,
            p.id AS product_id,
            p.title,
            p.price,
            p.description,
            (
                SELECT json_agg(url ORDER BY display_order)
                FROM product_images
                WHERE product_id = p.id
            ) AS images
        FROM favorites f
        INNER JOIN products p ON p.id = f.product_id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`,
        [userId]
    );

    const items = result.rows.map(item => ({
        ...item,
        images: item.images || [],
        image: item.images?.[0] || "/products/placeholder.jpg"
    }));

    return (
        <main className="bg-gray-50 min-h-screen pb-16">
            
            {/* Elegant Header */}
            <div className="bg-[#2F4F4F] pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-6 shadow-xl border border-white/20">
                        <Heart className="w-8 h-8 text-red-400 fill-red-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                        Your Curated Favorites
                    </h1>
                    <p className="text-lg text-gray-300">
                        A personal collection of handcrafted pieces that inspire you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xl max-w-3xl mx-auto">
                        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Your collection is empty
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                            Start exploring our artisan marketplace and save the pieces that catch your eye.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#F26419] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Explore Marketplace
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:border-gray-300 transition-all duration-500 flex flex-col relative"
                            >
                                {/* Remove Overlay */}
                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <RemoveFromFavoritesButton favoriteId={item.id} />
                                </div>

                                {/* Image Section */}
                                <Link href={`/products/${item.product_id}`} className="block relative w-full aspect-square bg-gray-50 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <Link href={`/products/${item.product_id}`}>
                                        <h2 className="font-bold text-lg text-gray-900 group-hover:text-[#F26419] transition-colors line-clamp-1 mb-1">
                                            {item.title}
                                        </h2>
                                    </Link>
                                    
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                        <p className="text-xl font-bold text-[#2F4F4F]">
                                            ${Number(item.price).toFixed(2)}
                                        </p>
                                        
                                        <Link
                                            href={`/products/${item.product_id}`}
                                            className="p-2.5 bg-gray-50 hover:bg-[#F26419] text-gray-600 hover:text-white rounded-lg transition-colors shadow-sm"
                                            aria-label={`View ${item.title}`}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
