#!/usr/bin/env node

/**
 * Database setup script that automatically creates the database if it doesn't exist
 * and then runs migrations.
 */

const { Client } = require('pg');
const { execSync } = require('child_process');
require('dotenv').config();

const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
};

const dbName = process.env.PGDATABASE || 'community_board';

async function createDatabaseIfNotExists() {
  console.log('🔍 Checking if database exists...');
  
  // Connect to postgres database (default) to check if our database exists
  const client = new Client({
    ...dbConfig,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server');

    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`📝 Database "${dbName}" does not exist. Creating...`);
      
      // Create the database
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }

  } catch (error) {
    console.error('❌ Error checking/creating database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  console.log('🔄 Running migrations...');
  
  try {
    // Run migrations using node-pg-migrate
    execSync('npm run migrate', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  }
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  try {
    await createDatabaseIfNotExists();
    console.log(''); // Empty line for readability
    await runMigrations();
    console.log('\n🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { createDatabaseIfNotExists, runMigrations, setupDatabase };
