const { z } = require('zod');
const { createPatient, getPatientById, listPatients } = require('../models/patientModel');

const createSchema = z.object({
  userId: z.string().uuid(),
  documentId: z.string().min(5),
  birthDate: z.string(),
  phone: z.string().min(8)
});

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const patient = await createPatient(data);
    return res.status(201).json({ patient });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'not_found' });
    }
    return res.json({ patient });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const patients = await listPatients();
    return res.json({ patients });
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, getById, list };
