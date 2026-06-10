import { db } from "@/lib/db";
import ArtisanCard from "@/components/sellers/ArtisanCard";
import Pagination from "@/components/ui/Pagination";

export const dynamic = "force-dynamic";

async function getSellers(page: number, limit: number) {
    try {
        const offset = (page - 1) * limit;
        
        // 1. Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM "users" WHERE role = 'seller'`
        );
        const totalCount = parseInt(countResult.rows[0].count, 10);
        
        // 2. Get paginated sellers
        const sellersResult = await db.query(
            `SELECT id, name, bio, location, avatar_url AS "avatarUrl" 
             FROM "users" 
             WHERE role = 'seller' 
             ORDER BY name ASC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
        const sellers = sellersResult.rows;

        // 3. Get top 4 products for each seller for the sneak peek
        if (sellers.length > 0) {
            const sellerIds = sellers.map(s => s.id);
            const placeholders = sellerIds.map((_, i) => `$${i + 1}`).join(',');
            
            // Query products with their primary image
            // We use a window function to get up to 4 products per seller
            const productsResult = await db.query(
                `WITH RankedProducts AS (
                    SELECT 
                        p.id, 
                        p.title, 
                        p.seller_id,
                        (
                            SELECT url 
                            FROM product_images 
                            WHERE product_id = p.id AND is_primary = true 
                            LIMIT 1
                        ) as image,
                        ROW_NUMBER() OVER (PARTITION BY p.seller_id ORDER BY p.created_at DESC) as rn
                    FROM products p
                    WHERE p.seller_id IN (${placeholders}) AND p.status = 'active'
                )
                SELECT id, title, seller_id, image
                FROM RankedProducts
                WHERE rn <= 4`,
                sellerIds
            );

            // Group products by seller
            const productsBySeller = productsResult.rows.reduce((acc, row) => {
                if (!acc[row.seller_id]) acc[row.seller_id] = [];
                acc[row.seller_id].push({
                    id: row.id,
                    title: row.title,
                    image: row.image
                });
                return acc;
            }, {} as Record<number, any[]>);

            // Attach products to sellers
            for (const seller of sellers) {
                seller.products = productsBySeller[seller.id] || [];
            }
        }

        return { sellers, totalCount };
    } catch (error) {
        console.error("Error fetching sellers:", error);
        return { sellers: [], totalCount: 0 };
    }
}

export default async function SellersPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 6;
    
    const { sellers, totalCount } = await getSellers(currentPage, limit);
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <main className="bg-gray-50 min-h-screen pb-16">
            {/* Hero Header */}
            <div className="bg-[#2F4F4F] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Meet Our Artisans
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Discover the talented creators behind our unique handcrafted goods. 
                        Every artisan brings a story and a dedication to their craft.
                    </p>
                </div>
            </div>

            {/* Sellers Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {sellers.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                        <p className="text-xl text-gray-500 font-medium">No artisans found.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {sellers.map((seller) => (
                                <ArtisanCard key={seller.id} artisan={seller} />
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination totalPages={totalPages} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}