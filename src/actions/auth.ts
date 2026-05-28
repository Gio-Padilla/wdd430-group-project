"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function registerAction(data: any) {
    const { email, password, fullName, accountType } = data;

    if (!email || !password || !fullName) {
        return { error: "Missing required fields" };
    }

    try {
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                email,
                name: fullName,
                passwordHash: hashedPassword,
                role: accountType === "sell" ? "seller" : "buyer"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Failed to register account" };
    }
}

export async function loginAction(data: any) {
    try {
        const user = await db.user.findUnique({
            where: { email: data.email }
        });
        const redirectTo = user?.role === "seller" ? "/dashboard" : "/";

        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." };
                default:
                    return { error: "Something went wrong." };
            }
        }
        throw error; // Required for Next.js redirects to work from server actions
    }
}

export async function logoutAction() {
    await signOut({ redirectTo: "/" });
}
