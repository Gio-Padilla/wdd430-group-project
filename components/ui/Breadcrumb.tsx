import Link from "next/link"

type Props = {
    productName: string
}

export default function Breadcrumb({
    productName,
}: Props) {
    return (
        <div className="mb-6 text-sm text-#2F4F4F">

            <Link
                href="/products"
                className="hover:text-black transition"
            >
                Products
            </Link>

            <span className="mx-2">
                /
            </span>

            <span className="font-medium text-#2F4F4F">
                {productName}
            </span>

        </div>
    )
}