import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import ProductGrid from "@/components/ui/ProductGrid";
import { auth } from "@/auth";
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, GlobeIcon } from "@/components/ui/SocialIcons";

export const dynamic = "force-dynamic";

async function getSeller(id: string) {
    try {
        const result = await db.query(
            `SELECT id, name, bio, location, avatar_url AS "avatarUrl", banner_color, banner_image_url, social_links 
             FROM "users" 
             WHERE role = 'seller' AND id = $1`, 
             [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching seller:', error);
        return null;
    }
}

async function getProductsBySeller(sellerId: string) {
    try {
        const numericSellerId = parseInt(sellerId, 10);
        if (isNaN(numericSellerId)) return [];

        const result = await db.query(
            `SELECT 
                p.id, p.title, p.description, p.price, p.slug, 
                p.inventory_qty, p.avg_rating, p.review_count, p.status, 
                c.name as category,
                (
                    SELECT json_agg(url ORDER BY display_order)
                    FROM product_images
                    WHERE product_id = p.id
                ) as images
             FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE p.seller_id = $1 AND p.status = 'active'
             ORDER BY p.created_at DESC`,
            [numericSellerId]
        );
        
        return result.rows.map((product) => ({
            ...product,
            price: Number(product.price),
            images: product.images || [],
            image: product.images?.[0] || "/products/placeholder.jpg",
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export default async function SellerPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [seller, products] = await Promise.all([
        getSeller(params.id), 
        getProductsBySeller(params.id)
    ]);

    if (!seller) {
        notFound();
    }

    // Get user favorites for the ProductGrid
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

    // Map initialFavorited
    const mappedProducts = products.map(p => ({
        ...p,
        initialFavorited: favoritedProductIds.includes(p.id)
    }));

    return (
        <main className="bg-gray-50 min-h-screen pb-16">
            {/* Hero Banner Section */}
            <div 
                className="relative w-full h-48 sm:h-64 md:h-80"
                style={{
                    backgroundColor: seller.banner_image_url ? 'transparent' : (seller.banner_color || '#2F4F4F'),
                }}
            >
                {seller.banner_image_url && (
                    <Image 
                        src={seller.banner_image_url} 
                        alt={`${seller.name}'s Banner`} 
                        fill
                        className="object-cover" 
                        priority
                    />
                )}
                <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay"></div>
            </div>

            {/* Profile Info Overlay */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10 mb-12">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start text-center md:text-left">
                    
                    {/* Avatar */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative flex-shrink-0">
                        {seller.avatarUrl ? (
                            <Image 
                                src={seller.avatarUrl} 
                                alt={`${seller.name}'s avatar`} 
                                fill
                                sizes="160px"
                                className="object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-4xl">
                                {seller.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Bio & Details */}
                    <div className="flex-1 pt-2 flex flex-col items-center md:items-start">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                            {seller.name}
                        </h1>
                        
                        {seller.location && (
                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 mb-4 font-medium">
                                <MapPin className="w-4 h-4" />
                                <span>{seller.location}</span>
                            </div>
                        )}
                        
                        <div className="prose prose-sm sm:prose-base text-gray-600 max-w-3xl mb-6">
                            <p className="leading-relaxed">
                                {seller.bio || "This artisan hasn't provided a biography yet."}
                            </p>
                        </div>

                        {/* Social Links */}
                        {seller.social_links && (
                            <div className="flex items-center gap-4 mt-auto">
                                {seller.social_links.instagram && (
                                    <a href={seller.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <InstagramIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {seller.social_links.whatsapp && (
                                    <a href={seller.social_links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <WhatsAppIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {seller.social_links.tiktok && (
                                    <a href={seller.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <TikTokIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {seller.social_links.facebook && (
                                    <a href={seller.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <FacebookIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {seller.social_links.twitter && (
                                    <a href={seller.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <TwitterIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {seller.social_links.website && (
                                    <a href={seller.social_links.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2F4F4F] transition-colors p-2 bg-gray-50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 shadow-sm hover:shadow">
                                        <GlobeIcon className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Collection by {seller.name}
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        {mappedProducts.length} {mappedProducts.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {mappedProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                        <p className="text-xl text-gray-500 font-medium">
                            No products currently available from this artisan.
                        </p>
                    </div>
                ) : (
                    <ProductGrid products={mappedProducts} />
                )}
            </div>
        </main>
    );
}