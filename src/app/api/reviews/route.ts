import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { reviewIds } = body;

        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return new NextResponse("Missing or invalid reviewIds", { status: 400 });
        }

        const userId = Number(session.user.id);

        // Delete reviews that belong to this user and are in the reviewIds array
        // Building parameterized query for arbitrary length array
        const params = [userId, ...reviewIds];
        const placeholders = reviewIds.map((_, i) => `$${i + 2}`).join(", ");
        
        const query = `
            DELETE FROM "reviews" 
            WHERE "user_id" = $1 AND "id" IN (${placeholders})
            RETURNING id, product_id
        `;

        const result = await db.query(query, params);

        if (result.rowCount && result.rowCount > 0) {
            const productIds = [...new Set(result.rows.map(row => row.product_id))];
            
            for (const pId of productIds) {
                await db.query(`
                    UPDATE "products" 
                    SET 
                        "review_count" = (SELECT COUNT(*) FROM "reviews" WHERE "product_id" = $1),
                        "avg_rating" = COALESCE((
                            SELECT ROUND(AVG(rating)::numeric, 1) 
                            FROM "reviews" 
                            WHERE "product_id" = $1
                        ), 0)
                    WHERE "id" = $1
                `, [pId]);
            }
        }

        return NextResponse.json({ success: true, deletedCount: result.rowCount });
    } catch (error: any) {
        console.error("Failed to delete reviews:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { reviewId, rating, comment } = body;

        if (!reviewId || !rating || !comment) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userId = Number(session.user.id);

        // Update review ensuring it belongs to the user
        const query = `
            UPDATE "reviews"
            SET "rating" = $1, "comment" = $2
            WHERE "id" = $3 AND "user_id" = $4
            RETURNING *
        `;

        const result = await db.query(query, [rating, comment, reviewId, userId]);

        if (result.rowCount === 0) {
            return new NextResponse("Review not found or unauthorized", { status: 404 });
        }

        const productId = result.rows[0].product_id;

        await db.query(`
            UPDATE "products" 
            SET 
                "review_count" = (SELECT COUNT(*) FROM "reviews" WHERE "product_id" = $1),
                "avg_rating" = COALESCE((
                    SELECT ROUND(AVG(rating)::numeric, 1) 
                    FROM "reviews" 
                    WHERE "product_id" = $1
                ), 0)
            WHERE "id" = $1
        `, [productId]);

        return NextResponse.json({ success: true, review: result.rows[0] });
    } catch (error: any) {
        console.error("Failed to update review:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { productId, rating, comment } = body;

        if (!productId || !rating || !comment) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userId = Number(session.user.id);

        const query = `
            INSERT INTO "reviews" ("product_id", "user_id", "rating", "comment")
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await db.query(query, [productId, userId, rating, comment]);

        // Update product's average rating and review count
        await db.query(`
            UPDATE "products" 
            SET 
                "review_count" = "review_count" + 1,
                "avg_rating" = (
                    SELECT ROUND(AVG(rating)::numeric, 1) 
                    FROM "reviews" 
                    WHERE "product_id" = $1
                )
            WHERE "id" = $1
        `, [productId]);

        return NextResponse.json({ success: true, review: result.rows[0] });
    } catch (error: any) {
        console.error("Failed to create review:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}