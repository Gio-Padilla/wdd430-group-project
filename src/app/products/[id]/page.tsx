import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { products as fallbackProducts } from "@/data/products";

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

    try {
        // Get product
        const { rows } = await db.query(
            `
            SELECT
                p.id,
                p.title,
                p.description,
                p.price,
                (
                    SELECT url
                    FROM product_images
                    WHERE product_id = p.id
                    AND is_primary = true
                    LIMIT 1
                ) as image
            FROM products p
            WHERE p.id = $1
            `,
            [id]
        );

        if (rows.length > 0) {
            product = {
                ...rows[0],
                price: Number(rows[0].price),
                image:
                    rows[0].image ||
                    "/products/placeholder.jpg",
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
        <main className="p-6 max-w-4xl mx-auto">

            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-10">

                <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                    />
                </div>

                <div>
                    <h1 className="text-4xl font-bold mb-4">
                        {product.title}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {product.description}
                    </p>

                    <p className="text-2xl font-semibold mb-4">
                        ${product.price}
                    </p>
                </div>

            </div>

            {/* Rating Summary */}
            <section className="mt-12">

                <div className="bg-gray-100 rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-2">
                        Product Rating
                    </h2>

                    <p className="text-4xl font-bold">
                        ⭐ {averageRating}
                    </p>

                    <p className="text-gray-600">
                        Based on {reviews.length} reviews
                    </p>

                </div>

            </section>

            {/* Reviews */}
            <section className="mt-12">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold ">
                        Reviews ({reviews.length})
                    </h2>

                    {!session?.user ? (
                        <Link
                            href="/account"
                            className="bg-[#2F4F4F] hover:bg-[#F26419] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Sign In to Review
                        </Link>
                    ) : session.user.role === "buyer" ? (
                        <Link
                            href={`/products/${product.id}/review`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Write a Review
                        </Link>
                    ) : null}

                </div>

                {reviews.length === 0 ? (

                    <div className="border rounded-xl p-6 text-center">
                        <p className="text-gray-500">
                            No reviews yet for this product.
                        </p>
                    </div>

                ) : (

                    <div className="space-y-4">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="border rounded-xl p-5"
                            >

                                <div className="flex justify-between items-center mb-3">

                                    <h3 className="font-semibold">
                                        {review.name}
                                    </h3>

                                    <span className="text-yellow-500">
                                        {"⭐".repeat(review.rating)}
                                    </span>

                                </div>

                                <p className="text-gray-700 mb-3">
                                    {review.comment}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString(
                                        "en-US"
                                    )}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}