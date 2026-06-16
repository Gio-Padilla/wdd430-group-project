
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Items from "@/components/checkout/items";



export default async function Checkout() {
     const session = await auth();


        if (!session?.user) {
            redirect("/account");
        }
    
        const userId = Number(session.user.id);
    
        const result = await db.query(
            `SELECT
                f.id,
                p.id AS product_id,
                p.title,
                p.price,
                p.description,
                (
                    SELECT json_agg(url ORDER BY display_order)
                    FROM product_images
                    WHERE product_id = p.id
                ) AS images
            FROM favorites f
            INNER JOIN products p ON p.id = f.product_id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC`,
            [userId]
        );
    
        const favItems = result.rows.map(item => ({
            ...item,
            images: item.images || [],
            image: item.images?.[0] || "/products/placeholder.jpg"
        }));
        console.log(favItems)


        
    return(
        <div className="p-4 bg-background">
            <Items items={favItems} userId={userId}/>
        </div>
    )
}