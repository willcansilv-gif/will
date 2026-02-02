const { pool } = require('../config/db');

async function createUser({ email, passwordHash, role, fullName }) {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id, email, role, full_name, created_at',
    [email, passwordHash, role, fullName]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query('SELECT id, email, role, full_name, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function listUsers() {
  const result = await pool.query('SELECT id, email, role, full_name, created_at FROM users ORDER BY created_at DESC');
  return result.rows;
}

module.exports = { createUser, findUserByEmail, findUserById, listUsers };
