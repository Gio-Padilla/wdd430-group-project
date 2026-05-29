import ProductCard from "@/components/ui/ProductCard"
import { db } from "@/lib/db"
import { products as fallbackProducts } from "@/data/products"

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    let displayProducts = fallbackProducts;

    try {
        const { rows } = await db.query(`
          SELECT p.id, p.title, p.description, p.price, 
                 (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
          FROM products p
          WHERE p.status = 'active'
          ORDER BY p.created_at DESC
        `);
        
        if (rows.length > 0) {
            displayProducts = rows.map(product => ({
                ...product,
                price: Number(product.price),
                image: product.image || '/products/placeholder.jpg'
            }));
        }
    } catch (error) {
        console.error("Database connection failed, falling back to mock data:", error);
    }

    return (
        <main className="p-6">
            <h1 className="text-4xl font-bold mb-8">
                Handmade Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </main>
    )
}