import ProductCard from "@/components/ui/ProductCard"
import { pool } from "@/lib/db"

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { rows: products } = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, 
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
      FROM products p
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);

    return (
        <main className="p-6">
            <h1 className="text-4xl font-bold mb-8">
                Handmade Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            price: Number(product.price),
                            image: product.image || '/products/placeholder.jpg'
                        }}
                    />
                ))}
            </div>
        </main>
    )
}