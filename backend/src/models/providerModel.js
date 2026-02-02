const { pool } = require('../config/db');

async function createProvider({ userId, crm, specialty, organization }) {
  const result = await pool.query(
    'INSERT INTO providers (user_id, crm, specialty, organization) VALUES ($1, $2, $3, $4) RETURNING id, user_id, crm, specialty, organization, created_at',
    [userId, crm, specialty, organization]
  );
  return result.rows[0];
}

async function getProviderById(id) {
  const result = await pool.query(
    'SELECT p.id, p.user_id, p.crm, p.specialty, p.organization, p.created_at, u.full_name, u.email FROM providers p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
    [id]
  );
  return result.rows[0];
}

async function listProviders() {
  const result = await pool.query(
    'SELECT p.id, p.user_id, p.crm, p.specialty, p.organization, p.created_at, u.full_name, u.email FROM providers p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
  );
  return result.rows;
}

module.exports = { createProvider, getProviderById, listProviders };
