const { pool } = require('../config/db');

async function createPatient({ userId, documentId, birthDate, phone }) {
  const result = await pool.query(
    'INSERT INTO patients (user_id, document_id, birth_date, phone) VALUES ($1, $2, $3, $4) RETURNING id, user_id, document_id, birth_date, phone, created_at',
    [userId, documentId, birthDate, phone]
  );
  return result.rows[0];
}

async function getPatientById(id) {
  const result = await pool.query(
    'SELECT p.id, p.user_id, p.document_id, p.birth_date, p.phone, p.created_at, u.full_name, u.email FROM patients p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
    [id]
  );
  return result.rows[0];
}

async function listPatients() {
  const result = await pool.query(
    'SELECT p.id, p.user_id, p.document_id, p.birth_date, p.phone, p.created_at, u.full_name, u.email FROM patients p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
  );
  return result.rows;
}

module.exports = { createPatient, getPatientById, listPatients };
