const { pool } = require('../config/db');

async function createTriage({ patientId, symptoms, riskLevel, recommendation }) {
  const result = await pool.query(
    'INSERT INTO triages (patient_id, symptoms, risk_level, recommendation) VALUES ($1, $2, $3, $4) RETURNING id, patient_id, symptoms, risk_level, recommendation, created_at',
    [patientId, symptoms, riskLevel, recommendation]
  );
  return result.rows[0];
}

async function getTriageById(id) {
  const result = await pool.query('SELECT * FROM triages WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { createTriage, getTriageById };
