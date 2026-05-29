import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // 🔹 Raw PostgreSQL query (no Prisma)
                const result = await db.query(
                    "SELECT id, email, name, role, passwordhash FROM users WHERE email = $1",
                    [credentials.email]
                );

                const user = result.rows[0];

                if (!user || !user.passwordhash) {
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordhash
                );

                if (!passwordsMatch) {
                    return null;
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],

    pages: {
        signIn: "/account",
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});