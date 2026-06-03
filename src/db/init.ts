import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env' });

// Needed only if you're using ESM and need __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('Error: DATABASE_URL is not defined in your environment variables.');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    console.log('Connecting to Neon database...');
    await client.connect();

    console.log('Reading schema.sql file...');
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL DDL script to build structure...');
    await client.query(sql);

    console.log('Database structure successfully synchronized!');
  } catch (error) {
    console.error('Failed to populate database structure:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});