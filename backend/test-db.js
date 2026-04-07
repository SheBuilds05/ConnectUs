const http = require('http');
http.get('http://localhost:5000/api/health', (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (d) => console.log(d.toString()));
}).on('error', (e) => {
  console.error('Error:', e.message);
});

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected, time:', res.rows[0]);
  }
  pool.end();
});