import ProductCard from "./ProductCard";

type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    avg_rating?: number;
    review_count?: number;
};

type ProductGridProps = {
    products: Product[];
};

export default function ProductGrid({
    products,
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
                <p className="text-gray-500">
                    No products found matching your filters.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-gray-500 mb-5">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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