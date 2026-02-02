const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'vitahub',
  password: process.env.DB_PASSWORD || 'vitahub',
  database: process.env.DB_NAME || 'vitahub',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = { pool };
