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
        // check if user exists
        const existingUserResult = await db.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        const existingUser = existingUserResult.rows[0];

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        await db.query(
            `INSERT INTO users (email, name, passwordhash, role)
             VALUES ($1, $2, $3, $4)`,
            [
                email,
                fullName,
                hashedPassword,
                accountType === "sell" ? "seller" : "buyer",
            ]
        );

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Failed to register account" };
    }
}

export async function loginAction(data: any) {
    try {
        // get user for redirect logic
        const result = await db.query(
            "SELECT id, email, role FROM users WHERE email = $1",
            [data.email]
        );

        const user = result.rows[0];

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
        throw error;
    }
}

export async function logoutAction() {
    await signOut({ redirectTo: "/" });
}