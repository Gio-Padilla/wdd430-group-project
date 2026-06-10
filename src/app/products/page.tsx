import FilterBar from "@/components/ui/FilterBar";
import { db } from "@/lib/db";
import ProductGrid from "@/components/ui/ProductGrid";
import { auth } from "@/auth";

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

    const session = await auth();
    let favoritedProductIds: number[] = [];
    if (session?.user?.id) {
        try {
            const favResult = await db.query(
                `SELECT product_id FROM favorites WHERE user_id = $1`,
                [session.user.id]
            );
            favoritedProductIds = favResult.rows.map(r => r.product_id);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    }

    let query = `
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            p.avg_rating,
            p.review_count,
            c.name as category,
            (
                SELECT json_agg(url ORDER BY display_order)
                FROM product_images
                WHERE product_id = p.id
            ) as images
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
            images: product.images || [],
            image: product.images?.[0] || "/products/placeholder.jpg",
            initialFavorited: favoritedProductIds.includes(product.id),
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