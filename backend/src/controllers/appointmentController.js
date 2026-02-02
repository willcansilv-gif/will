const { z } = require('zod');
const { createAppointment, listAppointments, updateAppointmentStatus } = require('../models/appointmentModel');

const createSchema = z.object({
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  scheduledAt: z.string(),
  type: z.enum(['in_person', 'telemed', 'home']),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).default('scheduled')
});

const updateSchema = z.object({
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled'])
});

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const appointment = await createAppointment(data);
    return res.status(201).json({ appointment });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const appointments = await listAppointments();
    return res.json({ appointments });
  } catch (error) {
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const appointment = await updateAppointmentStatus(req.params.id, data.status);
    if (!appointment) {
      return res.status(404).json({ error: 'not_found' });
    }
    return res.json({ appointment });
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, list, updateStatus };
