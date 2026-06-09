import {db} from '@/lib/db';
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getSeller(id: string) {
    try {
        const result = await db.query('SELECT id, name, bio, location, avatar_url AS "avatarUrl" FROM "users" WHERE role = \'seller\' AND id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching seller:', error);
        return null;
    }
}

// fetch products for a specific seller
async function getProductsBySeller(sellerId: string) {
    try {

        const numericSellerId = parseInt(sellerId, 10);

        if (isNaN(numericSellerId)) {
            console.error('Invalid seller ID:', sellerId);
            return [];
        }

        const result = await db.query('SELECT "products".id, "products".title, "products".description, "products".price, "products".price AS "price", "products".slug, "products".inventory_qty, "products".avg_rating, "products".review_count, "products".status, "product_images".URL AS "imageUrl" FROM "products" LEFT JOIN "product_images" ON "products".id = "product_images".product_id AND "product_images".is_primary = true WHERE seller_id = $1', [numericSellerId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

interface SellerPageProps {
    params: Promise<{ id: string }>;
}

export default async function SellerPage({ params }: SellerPageProps) {
    const { id } = await params;
    const [seller, products] = await Promise.all([getSeller(id), getProductsBySeller(id)]);

    if (!seller) {
        notFound();
    }
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-12'>

                {seller.avatarUrl && (
                    <div className='mb-4'>
                      
                        <Image src={seller.avatarUrl} alt={`${seller.name}'s avatar`} width={150} height={150} className='rounded-full' />
                    </div>
                )}
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>{seller.name}</h1>
                <p className='text-gray-600 mb-2'>{seller.bio}</p>
                <p className='text-gray-500'>Location: {seller.location}</p>
              
            </div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Products by {seller.name}</h2>
            {products.length === 0 ? (
                <p className='text-gray-600'>No products found for this seller.</p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {products.map((product) => (
                        <div key={product.id} className='bg-white rounded-lg shadow-md p-4'>
                                {product.imageUrl && (
                                    <Image src={product.imageUrl} alt={product.title} width={300} height={300} className='rounded-lg' />
                                )}
                            <h3 className='text-xl font-bold text-gray-900'>{product.title}</h3>
                            <p className='text-gray-600 mt-2'>{product.description}</p>
                            <p className='text-2xl font-bold text-green-600 mt-4'>${product.price}</p>
                            <p className='text-gray-500 mt-2'>Inventory: {product.inventory_qty}</p>
                            <p className='text-gray-500 mt-1'>Rating: {product.avg_rating} ({product.review_count} reviews)</p>
                            <p className={`mt-2 font-semibold ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>Status: {product.status === 'active' ? 'Available' : 'Unavailable'}</p>
                          
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}