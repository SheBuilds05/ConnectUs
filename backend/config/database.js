const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
};

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database pool closed');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
  }
};
// Test database connection on startup
testConnection();

// Sync database models (optional)
syncDatabase();
module.exports = {
  pool,
  testConnection,
  query,
  closePool
};