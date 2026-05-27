import Image from "next/image"
import { products } from "@/data/products"
import ReviewSection from "@/components/StarRating"


type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function ProductDetailPage({
    params,
}: Props) {

    const { id } = await params

    const product = products.find(
        (p) => p.id === Number(id)
    )

    if (!product) {
        return (
            <h1 className="p-6 text-2xl">
                Product not found
            </h1>
        )
    }

    return (
        <main className="p-6 max-w-4xl mx-auto">

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

                    <p className="text-gray-500 font-medium mb-4">
                        by {product.seller}
                    </p>

                    <p className="text-gray-600 mb-6">
                        {product.description}
                    </p>

                    <p className="text-2xl font-semibold">
                        ${product.price}
                    </p>
                </div>

            </div>

            <ReviewSection />

        </main>
    )
}