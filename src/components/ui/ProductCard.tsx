import Image from "next/image"
import Link from "next/link"
import Badge from "@/components/ui/Badge"

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

            <div className="bg-[#DCDCDC] border border-black rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer h-full flex flex-col">

                <div className="relative w-full h-64 bg-white">

                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain"
                    />

                </div>

                <div className="p-5 flex flex-col flex-grow">

                    <h2 className="text-xl font-semibold mb-3 text-center text-[#2F4F4F]">
                        {product.title}
                    </h2>

                    <div className="flex justify-center mb-3">
                        <Badge className="bg-[#2F4F4F] text-white">
                            {product.category}
                        </Badge>
                    </div>

                    <p className="text-[#F26419] mb-3 text-center font-medium">
                        ⭐ {product.rating}
                    </p>

                    <p className="text-[#2F4F4F] mb-4 text-center flex-grow">
                        {product.description}
                    </p>

                    <p className="text-[#2176FF] text-sm text-center mb-3 font-medium">
                        Artisan: {product.seller}
                    </p>

                    <p className="text-2xl font-bold text-center text-[#000000]">
                        ${product.price}
                    </p>

                </div>

            </div>

        </Link>
    )
}