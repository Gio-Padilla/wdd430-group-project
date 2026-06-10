import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Please sign in first",
                },
                {
                    status: 401,
                }
            );
        }

        const { productId, quantity } =
            await request.json();

        const userId = Number(session.user.id);

        const existing = await db.query(
            `
            SELECT id, quantity
            FROM cart_items
            WHERE user_id = $1
            AND product_id = $2
            `,
            [userId, productId]
        );

        if (existing.rows.length > 0) {
            await db.query(
                `
                UPDATE cart_items
                SET quantity = quantity + $1
                WHERE id = $2
                `,
                [
                    quantity,
                    existing.rows[0].id,
                ]
            );
        } else {
            await db.query(
                `
                INSERT INTO cart_items (
                    user_id,
                    product_id,
                    quantity
                )
                VALUES ($1, $2, $3)
                `,
                [
                    userId,
                    productId,
                    quantity,
                ]
            );
        }

        return NextResponse.json({
            success: true,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to add item to cart",
            },
            {
                status: 500,
            }
        );
    }

}

export async function DELETE(
    request: Request
) {
    try {

        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { cartItemId } =
            await request.json();

        await db.query(
            `
            DELETE FROM cart_items
            WHERE id = $1
            AND user_id = $2
            `,
            [
                cartItemId,
                Number(session.user.id),
            ]
        );

        return NextResponse.json({
            success: true,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Failed to remove item",
            },
            {
                status: 500,
            }
        );
    }
}