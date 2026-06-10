import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { products as fallbackProducts } from "@/data/products";
import { Star, ArrowLeft } from "lucide-react";
import AddToFavoritesButton from "@/components/favorites/AddToFavoritesButton";
import ProductImageGallery from "@/components/products/ProductImageGallery";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductDetailPage({ params }: Props) {

    const session = await auth();
    const { id } = await params;

    let product = null;
    let reviews: any[] = [];
    let isFavorited = false;

    try {
        // Get product
        const { rows } = await db.query(
            `
            SELECT
                p.id,
                p.title,
                p.description,
                p.price,
                p.avg_rating,
                p.review_count,
                c.name as category,
                u.name as seller_name,
                u.id as seller_id,
                (
                    SELECT json_agg(url ORDER BY display_order)
                    FROM product_images
                    WHERE product_id = p.id
                ) as images
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN users u ON u.id = p.seller_id
            WHERE p.id = $1
            `,
            [id]
        );

        if (rows.length > 0) {
            product = {
                ...rows[0],
                price: Number(rows[0].price),
                images: rows[0].images || [],
                image: rows[0].images?.[0] || "/products/placeholder.jpg",
            };
        }

        // Get reviews
        const reviewResult = await db.query(
            `
            SELECT
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name
            FROM reviews r
            INNER JOIN users u
                ON u.id = r.user_id
            WHERE r.product_id = $1
            ORDER BY r.created_at DESC
            `,
            [id]
        );

        reviews = reviewResult.rows;

        // Check if user has favorited this product
        if (session?.user) {
            const favResult = await db.query(
                `SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2`,
                [Number(session.user.id), id]
            );
            isFavorited = favResult.rows.length > 0;
        }

    } catch (error) {
        console.error(
            `Database connection failed for product ${id}:`,
            error
        );
    }

    // Fallback to mock data
    if (!product) {
        product = fallbackProducts.find(
            (p) => p.id === Number(id)
        );
    }

    if (!product) {
        return (
            <h1 className="p-6 text-2xl">
                Product not found
            </h1>
        );
    }

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (sum, review) =>
                          sum + review.rating,
                      0
                  ) / reviews.length
              ).toFixed(1)
            : "0.0";

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

            {/* Breadcrumb */}
            <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#F26419] transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </Link>

            {/* Product Hero */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-2">

                    {/* Image Gallery */}
                    <ProductImageGallery images={product.images || [product.image]} title={product.title} />

                    {/* Info Panel */}
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                            {/* Category Badge */}
                            {product.category && (
                                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#F26419] bg-[#F26419]/10 px-3 py-1 rounded-full mb-3">
                                    {product.category}
                                </span>
                            )}

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                {product.title}
                            </h1>

                            {/* Rating Row */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-gray-900">
                                        {averageRating}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-400">
                                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                                </span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Seller */}
                            {product.seller_name && (
                                <p className="text-sm text-gray-500 mb-6">
                                    Crafted by{" "}
                                    <Link href={`/sellers/${product.seller_id}`} className="font-semibold text-[#2F4F4F] underline underline-offset-2 decoration-[#2F4F4F]/30 hover:text-[#F26419] hover:decoration-[#F26419] transition-colors">
                                        {product.seller_name}
                                    </Link>
                                </p>
                            )}
                        </div>

                        {/* Price + Action */}
                        <div className="border-t border-gray-100 pt-5 mt-2">
                            <p className="text-3xl sm:text-4xl font-bold text-[#2F4F4F] mb-4">
                                ${product.price.toFixed(2)}
                            </p>

                            <AddToFavoritesButton
                                productId={Number(product.id)}
                                initialFavorited={isFavorited}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-10 sm:mt-14">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-[#2F4F4F]">
                        Reviews ({reviews.length})
                    </h2>

                    {!session?.user ? (
                        <Link
                            href="/account"
                            className="inline-flex items-center justify-center gap-2 bg-[#2F4F4F] hover:bg-[#F26419] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                        >
                            Sign In to Review
                        </Link>
                    ) : session.user.role === "buyer" ? (
                        <Link
                            href={`/products/${product.id}/review`}
                            className="inline-flex items-center justify-center gap-2 bg-[#2F4F4F] hover:bg-[#F26419] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                        >
                            Write a Review
                        </Link>
                    ) : null}
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                            No reviews yet. Be the first to share your thoughts!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#2F4F4F] flex items-center justify-center text-white font-bold text-sm">
                                            {review.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                {review.name}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {new Date(review.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}