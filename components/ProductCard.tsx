import Image from "next/image"
import Link from "next/link"

type Product = {
    id: number
    title: string
    description: string
    price: number
    image: string
    category: string
    rating: number
    seller: string
}

export default function ProductCard({
    product,
}: {
    product: Product
}) {
    return (
        <Link href={`/products/${product.id}`}>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer h-full flex flex-col">

                <div className="relative w-full h-64 bg-gray-100">

                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain"
                    />

                </div>

                <div className="p-5 flex flex-col flex-grow">


                    <h2 className="text-xl font-semibold mb-2 text-center">
                        {product.title}
                    </h2>

                    <p className="text-yellow-500 mb-3 text-center">
                        ⭐ {product.rating}
                    </p>

                    <p className="text-gray-700 mb-4 text-center flex-grow">
                        {product.description}
                    </p>

                    <p className="text-gray-500 text-sm text-center mb-3">
                        Artisan: {product.seller}
                    </p>

                    <p className="text-2xl font-bold text-center">
                        ${product.price}
                    </p>

                </div>

            </div>

        </Link>
    )
}