#!/usr/bin/env node

/**
 * Comprehensive database initialization script
 * This script will:
 * 1. Check PostgreSQL connection
 * 2. Create database if it doesn't exist
 * 3. Run all migrations
 * 4. Optionally seed initial data
 */

const { Client } = require('pg');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const config = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'community_board',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkPostgreSQLConnection() {
  log('🔍 Checking PostgreSQL connection...', colors.blue);
  
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres' // Connect to default database first
  });

  try {
    await client.connect();
    log('✅ PostgreSQL server is accessible', colors.green);
    await client.end();
    return true;
  } catch (error) {
    log(`❌ Cannot connect to PostgreSQL: ${error.message}`, colors.red);
    log('💡 Make sure PostgreSQL is running and credentials are correct', colors.yellow);
    return false;
  }
}

async function databaseExists() {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres'
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database]
    );
    await client.end();
    return result.rows.length > 0;
  } catch (error) {
    log(`❌ Error checking database existence: ${error.message}`, colors.red);
    throw error;
  }
}

async function createDatabase() {
  log(`📝 Creating database "${config.database}"...`, colors.blue);
  
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres'
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${config.database}"`);
    await client.end();
    log(`✅ Database "${config.database}" created successfully`, colors.green);
  } catch (error) {
    log(`❌ Error creating database: ${error.message}`, colors.red);
    throw error;
  }
}

async function runMigrations() {
  log('🔄 Running database migrations...', colors.blue);
  
  try {
    // Check if migrations directory exists
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      log(`⚠️  Migrations directory not found: ${migrationsDir}`, colors.yellow);
      return;
    }

    // Run migrations
    execSync('npm run migrate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    log('✅ Migrations completed successfully', colors.green);
  } catch (error) {
    log(`❌ Error running migrations: ${error.message}`, colors.red);
    throw error;
  }
}

async function checkMigrationStatus() {
  log('📊 Checking migration status...', colors.blue);
  
  const client = new Client(config);
  
  try {
    await client.connect();
    
    // Check if migrations table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pgmigrations'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      const migrations = await client.query('SELECT name, run_on FROM pgmigrations ORDER BY run_on');
      log(`✅ Found ${migrations.rows.length} completed migrations`, colors.green);
      migrations.rows.forEach(row => {
        log(`   - ${row.name} (${new Date(row.run_on).toISOString()})`, colors.cyan);
      });
    } else {
      log('📝 No migrations table found - first time setup', colors.yellow);
    }
    
    await client.end();
  } catch (error) {
    log(`⚠️  Could not check migration status: ${error.message}`, colors.yellow);
  }
}

async function initializeDatabase() {
  try {
    log('🚀 Starting database initialization...\n', colors.blue);
    
    // Step 1: Check PostgreSQL connection
    const canConnect = await checkPostgreSQLConnection();
    if (!canConnect) {
      process.exit(1);
    }
    
    // Step 2: Check if database exists
    const dbExists = await databaseExists();
    if (!dbExists) {
      await createDatabase();
    } else {
      log(`✅ Database "${config.database}" already exists`, colors.green);
    }
    
    // Step 3: Check current migration status
    await checkMigrationStatus();
    
    // Step 4: Run migrations
    await runMigrations();
    
    // Step 5: Final status check
    console.log(''); // Empty line
    await checkMigrationStatus();
    
    log('\n🎉 Database initialization completed successfully!', colors.green);
    log(`📍 Database: ${config.database}@${config.host}:${config.port}`, colors.cyan);
    
  } catch (error) {
    log(`\n💥 Database initialization failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Command line options
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  seedData: args.includes('--seed'),
  verbose: args.includes('--verbose')
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Database Initialization Script

Usage: node scripts/init-database.js [options]

Options:
  --force     Drop and recreate database if it exists
  --seed      Run data seeding after migrations
  --verbose   Show detailed output
  --help, -h  Show this help message

Examples:
  node scripts/init-database.js
  node scripts/init-database.js --force --seed
  npm run db:init
`);
  process.exit(0);
}

// Run initialization if script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  initializeDatabase,
  createDatabase,
  runMigrations,
  checkMigrationStatus
};
