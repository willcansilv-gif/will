const { pool } = require('../config/db');

async function createTelemedSession({ appointmentId, roomToken, status }) {
  const result = await pool.query(
    'INSERT INTO telemed_sessions (appointment_id, room_token, status) VALUES ($1, $2, $3) RETURNING id, appointment_id, room_token, status, created_at',
    [appointmentId, roomToken, status]
  );
  return result.rows[0];
}

async function getTelemedSession(id) {
  const result = await pool.query('SELECT * FROM telemed_sessions WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { createTelemedSession, getTelemedSession };
