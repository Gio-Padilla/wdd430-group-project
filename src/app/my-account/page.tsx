import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import GroupedReviews from "@/components/account/GroupedReviews";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function MyAccountPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/account?mode=login");
    }

    const userId = Number(session.user.id);
    
    // Fetch fresh user data from DB
    const result = await db.query(
        `SELECT id, name, role, email, avatar_url FROM "users" WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        redirect("/account");
    }

    const user = result.rows[0];

    // Fetch user's reviews
    const reviewsResult = await db.query(
        `SELECT 
            r.id, r.product_id, r.rating, r.comment, r.created_at, 
            p.title as product_title, 
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order ASC LIMIT 1) as product_image
         FROM reviews r
         JOIN products p ON p.id = r.product_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
    );

    // Group reviews by product
    const grouped = reviewsResult.rows.reduce((acc: any, review: any) => {
        if (!acc[review.product_id]) {
            acc[review.product_id] = {
                product_id: review.product_id,
                product_title: review.product_title,
                product_image: review.product_image,
                reviews: []
            };
        }
        acc[review.product_id].reviews.push(review);
        return acc;
    }, {});

    const groupedReviews: any[] = Object.values(grouped);

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Profile Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#F26419] text-white flex items-center justify-center text-3xl font-bold overflow-hidden relative">
                        {user.avatar_url ? (
                            <Image src={user.avatar_url} alt={user.name} fill sizes="80px" className="object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Grouped Reviews Component */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Products I've Reviewed</h2>
                    <GroupedReviews groupedReviews={groupedReviews} />
                </div>
            </div>
        </main>
    );
}
