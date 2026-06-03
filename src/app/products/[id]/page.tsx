import Image from "next/image"
import { db } from "@/lib/db"
import { products as fallbackProducts } from "@/data/products"
import ReviewSection from "@/components/StarRating"
import Button from "@/components/ui/Button"
import Breadcrumb from "@/components/ui/Breadcrumb"

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params
    let product = null

    try {
        const { rows } = await db.query(
            `
            SELECT p.id, p.title, p.description, p.price,
                   (SELECT url
                    FROM product_images
                    WHERE product_id = p.id
                      AND is_primary = true
                    LIMIT 1) as image
            FROM products p
            WHERE p.id = $1
            `,
            [id]
        )

        if (rows.length > 0) {
            product = {
                ...rows[0],
                price: Number(rows[0].price),
                image: rows[0].image || "/products/placeholder.jpg",
            }
        }
    } catch (error) {
        console.error(
            `Database connection failed for product ${id}, falling back to mock data:`,
            error
        )
    }

    if (!product) {
        product = fallbackProducts.find(
            (p) => p.id === Number(id)
        )
    }

    if (!product) {
        return (
            <h1 className="p-6 text-2xl text-[#2F4F4F]">
                Product not found
            </h1>
        )
    }

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <Breadcrumb productName={product.title} />

            <div className="grid md:grid-cols-2 gap-10 bg-[#DCDCDC] border border-black rounded-3xl p-8 shadow-md">
                <div className="relative w-full h-96 bg-white rounded-2xl overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                    />
                </div>

                <div>
                    <h1 className="text-4xl font-bold mb-4 text-[#2F4F4F]">
                        {product.title}
                    </h1>

                    <p className="text-[#2176FF] font-medium mb-4">
                        Artisan: {product.seller}
                    </p>

                    <p className="text-[#2F4F4F] mb-6">
                        {product.description}
                    </p>

                    <p className="text-3xl font-bold text-[#000000] mb-8">
                        ${product.price}
                    </p>

                    <Button>
                        Add to Cart
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <ReviewSection />
            </div>
        </main>
    )
}