#!/usr/bin/env node

/**
 * Complete development environment setup script
 * This script will:
 * 1. Create the database if it doesn't exist
 * 2. Run all migrations
 * 3. Optionally seed with test data
 */

const { setupDatabase } = require('./setup-database');
const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'community_board',
};

async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check if we already have test data
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    const eventCheck = await client.query('SELECT COUNT(*) FROM events');
    
    if (parseInt(userCheck.rows[0].count) > 0 || parseInt(eventCheck.rows[0].count) > 0) {
      console.log('📊 Test data already exists, skipping seeding');
      return;
    }
    
    // Create test user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userResult = await client.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['testuser', 'test@example.com', hashedPassword, 'user']
    );
    
    const userId = userResult.rows[0].id;
    
    // Create test events
    const testEvents = [
      {
        title: 'Community Cleanup Day',
        description: 'Help clean up our local park and make it beautiful for everyone!',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        location: 'Central Park',
        organizer: 'Parks Department',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        volunteer_positions: JSON.stringify([
          { name: 'Trash Pickup', count: 10 },
          { name: 'Garden Maintenance', count: 5 }
        ])
      },
      {
        title: 'Food Drive',
        description: 'Collect and distribute food to families in need.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        location: 'Community Center',
        organizer: 'Local Food Bank',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500',
        volunteer_positions: JSON.stringify([
          { name: 'Food Collection', count: 8 },
          { name: 'Distribution', count: 6 },
          { name: 'Setup/Cleanup', count: 4 }
        ])
      }
    ];
    
    for (const event of testEvents) {
      await client.query(
        'INSERT INTO events (title, description, date, location, organizer, image, volunteer_positions, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [event.title, event.description, event.date, event.location, event.organizer, event.image, event.volunteer_positions, userId]
      );
    }
    
    console.log('✅ Test data seeded successfully');
    console.log('📝 Test user credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
  } finally {
    await client.end();
  }
}

async function setupDevelopmentEnvironment() {
  console.log('🛠️  Setting up development environment...\n');
  
  try {
    // Step 1: Setup database and run migrations
    await setupDatabase();
    
    console.log(''); // Empty line for readability
    
    // Step 2: Seed test data
    await seedTestData();
    
    console.log('\n🎉 Development environment setup completed!');
    console.log('\n📚 Next steps:');
    console.log('   1. cd to backend directory: cd backend');
    console.log('   2. Start the backend server: npm run dev');
    console.log('   3. In another terminal, cd to frontend: cd ../frontend');
    console.log('   4. Start the frontend: npm start');
    console.log('   5. Open http://localhost:3000 in your browser');
    
  } catch (error) {
    console.error('❌ Development environment setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDevelopmentEnvironment();
}

module.exports = { setupDevelopmentEnvironment, seedTestData };
