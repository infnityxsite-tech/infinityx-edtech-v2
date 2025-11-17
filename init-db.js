// init-db.js - Initialize PostgreSQL database with schema and default data
import { readFileSync } from 'fs';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDatabase() {
  try {
    console.log('\n🔧 Initializing InfinityX EdTech Database...\n');
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));

    // Read schema file
    let schema = readFileSync('./schema.sql', 'utf8');

    // Generate bcrypt hash for default admin password
    console.log('🔐 Generating secure password hash for default admin...');
    const defaultPassword = 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    // Replace placeholder hash with actual bcrypt hash
    schema = schema.replace(
      '$2b$10$rKqF5xZ8YxZ8YxZ8YxZ8YeJ5xZ8YxZ8YxZ8YxZ8YxZ8YxZ8YxZ8Yx',
      passwordHash
    );

    // Execute schema
    console.log('📊 Creating tables and indexes...');
    await pool.query(schema);

    // Run migrations
    console.log('🔄 Running database migrations...');
    try {
      await pool.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_link TEXT');
      console.log('✅ Migration: Added course_link column to courses table');
    } catch (migrationError) {
      console.log('ℹ️  Migration already applied or skipped');
    }

    console.log('\n✅ Database initialized successfully!\n');
    console.log('===========================================');
    console.log('📋 Default Admin Credentials:');
    console.log('===========================================');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('===========================================');
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
