import Image from "next/image"
import Link from "next/link"

type Product = {
    id: number
    title: string
    description: string
    price: number
    image: string
}

export default function ProductCard({
    product,
}: {
    product: Product
}) {
    return (
        <Link href={`/products/${product.id}`}>
            <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">

                <div className="relative w-full h-64">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain"
                    />
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                        {product.title}
                    </h2>

                    <p className="text-gray-700 mb-4 text-center">
                        {product.description}
                    </p>

                    <p className="text-gray-600 text-lg text-center">
                        ${product.price}
                    </p>
                </div>

            </div>
        </Link>
    )
}