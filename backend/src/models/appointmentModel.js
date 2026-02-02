const { pool } = require('../config/db');

async function createAppointment({ patientId, providerId, scheduledAt, type, status }) {
  const result = await pool.query(
    'INSERT INTO appointments (patient_id, provider_id, scheduled_at, type, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, patient_id, provider_id, scheduled_at, type, status, created_at',
    [patientId, providerId, scheduledAt, type, status]
  );
  return result.rows[0];
}

async function listAppointments() {
  const result = await pool.query(
    'SELECT a.id, a.patient_id, a.provider_id, a.scheduled_at, a.type, a.status, a.created_at, p.user_id AS patient_user_id, pr.user_id AS provider_user_id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN providers pr ON a.provider_id = pr.id ORDER BY a.scheduled_at DESC'
  );
  return result.rows;
}

async function updateAppointmentStatus(id, status) {
  const result = await pool.query(
    'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING id, patient_id, provider_id, scheduled_at, type, status, created_at',
    [status, id]
  );
  return result.rows[0];
}

module.exports = { createAppointment, listAppointments, updateAppointmentStatus };
