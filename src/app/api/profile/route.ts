import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, bio, location, avatar_url, banner_color, banner_image_url, social_links } = body;

        const userId = session.user.id;
        const role = session.user.role;

        // Validation for buyer: only allow name update
        if (role === "buyer") {
            if (!name) {
                return new NextResponse("Name is required", { status: 400 });
            }
            await db.query(`UPDATE "users" SET name = $1 WHERE id = $2`, [name, userId]);
        } else {
            // Seller can update everything
            if (!name) {
                return new NextResponse("Name is required", { status: 400 });
            }
            
            await db.query(
                `UPDATE "users" 
                 SET name = $1, bio = $2, location = $3, avatar_url = $4, banner_color = $5, banner_image_url = $6, social_links = $7 
                 WHERE id = $8`,
                [
                    name, 
                    bio || null, 
                    location || null, 
                    avatar_url || null, 
                    banner_color || null, 
                    banner_image_url || null, 
                    social_links ? JSON.stringify(social_links) : null,
                    userId
                ]
            );
        }

        revalidatePath("/settings");
        revalidatePath(`/sellers/${userId}`);
        revalidatePath(`/sellers`);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE() {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;

        // Because we have ON DELETE CASCADE in the database, this will cleanly 
        // remove the user and their products, orders, favorites, etc.
        await db.query(`DELETE FROM "users" WHERE id = $1`, [userId]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Account deletion error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
