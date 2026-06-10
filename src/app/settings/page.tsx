import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/account?mode=login");
    }

    const userId = Number(session.user.id);
    
    // Fetch fresh user data from DB
    const result = await db.query(
        `SELECT id, name, role, email, avatar_url, banner_color, banner_image_url, bio, location, social_links 
         FROM "users" 
         WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        redirect("/account");
    }

    const user = result.rows[0];

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
                <SettingsClient user={user} />
            </div>
        </main>
    );
}
