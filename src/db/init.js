const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("Error: DATABASE_URL is not defined in your environment variables.");
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

seedDatabase();
