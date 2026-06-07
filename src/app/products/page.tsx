import FilterBar from "@/components/ui/FilterBar";
import { db } from "@/lib/db";
import ProductGrid from "@/components/ui/ProductGrid";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
}>;

const categoriesResult = await db.query(`
    SELECT id, name
    FROM categories
    ORDER BY name
`);

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { category, minPrice, maxPrice } = await searchParams;

    let query = `
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            c.name as category,
            (
                SELECT url
                FROM product_images
                WHERE product_id = p.id
                AND is_primary = true
                LIMIT 1
            ) as image
        FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE p.status = 'active'
    `;

    const values: (string | number)[] = [];
    let paramCount = 1;

    if (category) {
        query += ` AND p.category_id = $${paramCount}`;
        values.push(category);
        paramCount++;
    }

    if (minPrice) {
        query += ` AND p.price >= $${paramCount}`;
        values.push(Number(minPrice));
        paramCount++;
    }

    if (maxPrice) {
        query += ` AND p.price <= $${paramCount}`;
        values.push(Number(maxPrice));
        paramCount++;
    }

    query += ` ORDER BY p.created_at DESC`;

    let products = [];

    try {
        const { rows } = await db.query(query, values);

        products = rows.map((product) => ({
            ...product,
            price: Number(product.price),
            image: product.image || "/products/placeholder.jpg",
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    return (
        <main className="p-6">
            <h1 className="text-4xl font-bold mb-8">
                Handmade Products
            </h1>

            <FilterBar
                categories={categoriesResult.rows}
            />

            <ProductGrid products={products} />

        </main>
    );
}