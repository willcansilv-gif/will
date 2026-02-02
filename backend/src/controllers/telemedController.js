const { z } = require('zod');
const crypto = require('crypto');
const { createTelemedSession, getTelemedSession } = require('../models/telemedModel');

const createSchema = z.object({
  appointmentId: z.string().uuid()
});

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const roomToken = crypto.randomUUID();
    const session = await createTelemedSession({
      appointmentId: data.appointmentId,
      roomToken,
      status: 'active'
    });
    return res.status(201).json({ session });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const session = await getTelemedSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'not_found' });
    }
    return res.json({ session });
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, getById };
