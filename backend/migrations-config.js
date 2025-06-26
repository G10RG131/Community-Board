// migrations-config.js
const path = require('path');
require('dotenv').config();

const config = {
  database: process.env.PGDATABASE || 'community_board',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  
  // Migration settings
  migrationsTable: 'pgmigrations',
  dir: path.join(__dirname, 'migrations'),
  checkOrder: true,
  verbose: true,
  
  // SSL settings (useful for production)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

module.exports = {
  dev: config,
  production: {
    ...config,
    ssl: { rejectUnauthorized: false }
  }
};
