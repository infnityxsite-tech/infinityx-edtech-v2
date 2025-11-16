// server/auto-init-db.ts - Auto-initialize database on server startup
import { query, queryOne } from './database';
import { hashPassword } from './_core/auth';
import fs from 'fs';
import path from 'path';

/**
 * Check if database is initialized by checking if admin_users table exists
 */
async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      )`
    );
    return result?.exists || false;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
}

/**
 * Initialize database with schema and seed data
 */
export async function autoInitializeDatabase(): Promise<void> {
  try {
    console.log('🔍 Checking if database needs initialization...');
    
    const isInitialized = await isDatabaseInitialized();
    
    if (isInitialized) {
      console.log('✅ Database already initialized');
      return;
    }

    console.log('🚀 Initializing database...');

    // Read and execute schema.sql
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ schema.sql not found at:', schemaPath);
      throw new Error('schema.sql file not found');
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (!error.message?.includes('already exists')) {
          console.error('Error executing statement:', error);
        }
      }
    }

    // Create default admin user with proper bcrypt hash
    console.log('👤 Creating default admin user...');
    const defaultPassword = 'admin123';
    const passwordHash = await hashPassword(defaultPassword);

    await query(
      `INSERT INTO admin_users (username, password_hash, email, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', passwordHash, 'admin@infinityx.com', 'Administrator']
    );

    console.log('✅ Database initialized successfully!');
    console.log('📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
