import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Please sign in first" },
                { status: 401 }
            );
        }

        const { productId } = await request.json();
        const userId = Number(session.user.id);

        // Check if already favorited
        const existing = await db.query(
            `SELECT id FROM favorites
             WHERE user_id = $1 AND product_id = $2`,
            [userId, productId]
        );

        if (existing.rows.length > 0) {
            // Already favorited — remove it (toggle off)
            await db.query(
                `DELETE FROM favorites WHERE id = $1`,
                [existing.rows[0].id]
            );

            return NextResponse.json({
                success: true,
                action: "removed",
            });
        } else {
            // Not yet favorited — add it
            await db.query(
                `INSERT INTO favorites (user_id, product_id)
                 VALUES ($1, $2)`,
                [userId, productId]
            );

            return NextResponse.json({
                success: true,
                action: "added",
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update favorites" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { favoriteId } = await request.json();

        await db.query(
            `DELETE FROM favorites
             WHERE id = $1 AND user_id = $2`,
            [favoriteId, Number(session.user.id)]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to remove favorite" },
            { status: 500 }
        );
    }
}
