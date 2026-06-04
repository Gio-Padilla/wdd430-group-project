import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {

        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "You must be signed in"
                },
                {
                    status: 401
                }
            );
        }

        if (session.user.role !== "buyer") {
            return NextResponse.json(
                {
                    error: "Only buyers can leave reviews"
                },
                {
                    status: 403
                }
            );
        }

        const {
            productId,
            rating,
            comment,
        } = await request.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json(
                {
                    error: "Missing required fields"
                },
                {
                    status: 400
                }
            );
        }

        const result = await db.query(
            `
            INSERT INTO reviews (
                product_id,
                user_id,
                rating,
                comment
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                productId,
                Number(session.user.id),
                rating,
                comment
            ]
        );

        return NextResponse.json({
            success: true,
            review: result.rows[0]
        });

    } catch (error) {

        console.error("REVIEW ERROR:", error);

        return NextResponse.json(
            {
                error: "Failed to save review"
            },
            {
                status: 500
            }
        );
    }
}