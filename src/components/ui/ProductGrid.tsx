import ProductCard from "./ProductCard";

type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
};

type ProductGridProps = {
    products: Product[];
};

export default function ProductGrid({
    products,
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div
                className="
                    rounded-xl
                    border-2
                    p-8
                    text-center
                "
                style={{
                    backgroundColor: "#DCDCDC",
                    borderColor: "#000000",
                }}
            >
                <p
                    style={{
                        fontFamily: "Quicksand",
                    }}
                >
                    No products found matching your filters.
                </p>
            </div>
        );
    }

    return (
        <div
            className="
                rounded-xl
                border-2
                p-6
                shadow-lg
            "
            style={{
                backgroundColor: "#DCDCDC",
                borderColor: "#000000",
            }}
        >
            <h2
                className="
                    text-2xl
                    uppercase
                    mb-6
                "
                style={{
                    fontFamily: "Aladin",
                    color: "#2F4F4F",
                }}
            >
                Products ({products.length})
            </h2>

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                "
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}