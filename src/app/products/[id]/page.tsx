import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { products as fallbackProducts } from "@/data/products";
import { Star, ArrowLeft } from "lucide-react";
import AddToFavoritesButton from "@/components/favorites/AddToFavoritesButton";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductReviews from "@/components/products/ProductReviews";

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

    const averageRating = product.avg_rating ? Number(product.avg_rating).toFixed(1) : "0.0";
    const reviewCount = product.review_count || 0;

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
                                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
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

            <ProductReviews 
                productId={Number(product.id)}
                initialReviews={reviews}
                sessionUser={session?.user}
                reviewCount={reviewCount}
            />

        </main>
    );
}