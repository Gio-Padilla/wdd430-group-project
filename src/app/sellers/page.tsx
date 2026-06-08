import Link from "next/link";
import Image from "next/image";
import { db } from '@/lib/db';

async function getSellers() {
    try {
        // Fetch sellers from the database
        const result = await db.query('SELECT id, name, bio, location, avatar_url AS "avatarUrl" FROM "users" WHERE role = \'seller\' ORDER BY name ASC' );
        return result.rows;
    } catch (error) {
        console.error('Error fetching sellers:', error);
        return [];
    }
}
export default async function SellersPage() {
    const sellers = await getSellers();

    if (sellers.length === 0) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='text-3xl font-bold text-gray-900'>Meet Our Artisans</h1>
                <p className='text-gray-600 mt-4'>No artisans found.</p>
            </div>
        );
    }
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <h1 className='text-3xl font-bold text-gray-900'>Meet Our Artisans</h1>
            <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {sellers.map((seller) => (
                    <div key={seller.id} className='bg-white rounded-lg shadow-md p-6'>
                        {seller.avatarUrl && (
                            <div className='mt-4'>
                                <Image  src={seller.avatarUrl} alt={`${seller.name}'s avatar`} width={100} height={100} className='rounded-full' />
                            </div>
                        )}
                        <h2 className='text-xl font-semibold text-gray-800'>{seller.name}</h2>
                        <p className='text-gray-600 mt-2'>{seller.bio}</p>
                        <p className='text-gray-500 mt-4'>Location: {seller.location}</p>
                        <Link href={`/sellers/${seller.id}`} className='hover:underline mt-2 block border border-blue-500 py-2 px-4 rounded bg-blue-500 text-white w-full text-center'>View Products</Link>
                        
                    
                    </div>
                ))}
            </div>
        </div>
    );
}