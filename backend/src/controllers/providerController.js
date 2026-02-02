const { z } = require('zod');
const { createProvider, getProviderById, listProviders } = require('../models/providerModel');

const createSchema = z.object({
  userId: z.string().uuid(),
  crm: z.string().min(4),
  specialty: z.string().min(2),
  organization: z.string().min(2)
});

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const provider = await createProvider(data);
    return res.status(201).json({ provider });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const provider = await getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'not_found' });
    }
    return res.json({ provider });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const providers = await listProviders();
    return res.json({ providers });
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, getById, list };
