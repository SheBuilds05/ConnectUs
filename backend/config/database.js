import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

console.log('🔐 Connecting to Supabase:');
console.log('   Host:', process.env.DB_HOST);
console.log('   Database:', process.env.DB_NAME);
console.log('   User:', process.env.DB_USER);
console.log('   SSL: Required for Supabase');

// Supabase requires SSL connections
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ✅ ADD THIS - Query helper function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Executed query:', { 
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''), 
      duration: `${duration}ms`, 
      rows: res.rowCount 
    });
    return res;
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`   Server time: ${result.rows[0].current_time}`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Fix: Check your password in .env');
      console.log('   You can reset it in Supabase Dashboard → Settings → Database');
    }
    if (error.message.includes('timeout')) {
      console.log('\n🔧 Fix: Check your hostname and network connection');
    }
    if (error.message.includes('does not exist')) {
      console.log('\n🔧 Fix: Database does not exist. Create it in Supabase dashboard');
    }
    return false;
  }
};

export const closePool = async () => {
  try {
    await pool.end();
    console.log('🛑 Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});