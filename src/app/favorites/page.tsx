import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import RemoveFromFavoritesButton from "@/components/favorites/RemoveFromFavoritesButton";

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/account");
    }

    const userId = Number(session.user.id);

    const result = await db.query(
        `
        SELECT
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
        INNER JOIN products p
            ON p.id = f.product_id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
        `,
        [userId]
    );

    const items = result.rows.map(item => ({
        ...item,
        images: item.images || [],
        image: item.images?.[0] || "/products/placeholder.jpg"
    }));

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
                <div className="p-2.5 bg-red-50 rounded-xl">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 fill-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#2F4F4F]">
                        My Favorites
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {items.length} {items.length === 1 ? "item" : "items"} saved
                    </p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No favorites yet
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Browse our collection and tap the heart on any
                        product you love to save it here.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#F26419] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                        >
                            {/* Image */}
                            <Link href={`/products/${item.product_id}`}>
                                <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                                    <Image
                                        src={item.image || "/products/placeholder.jpg"}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="p-4 sm:p-5">
                                <Link href={`/products/${item.product_id}`}>
                                    <h2 className="font-semibold text-lg text-gray-900 group-hover:text-[#F26419] transition-colors line-clamp-1">
                                        {item.title}
                                    </h2>
                                </Link>

                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xl font-bold text-[#2F4F4F]">
                                        ${Number(item.price).toFixed(2)}
                                    </p>

                                    <RemoveFromFavoritesButton
                                        favoriteId={item.id}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </main>
    );
}
