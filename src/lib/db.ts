import { Pool } from "pg";

let connectionString = process.env.DATABASE_URL || "";

// Suppress pg driver warning for Neon DB connection strings by enabling libpq compatibility
if (connectionString && !connectionString.includes("uselibpqcompat=true")) {
    const separator = connectionString.includes("?") ? "&" : "?";
    connectionString += `${separator}uselibpqcompat=true`;
}

export const db = new Pool({
    connectionString,
});