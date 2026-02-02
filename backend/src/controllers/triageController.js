const { z } = require('zod');
const { createTriage, getTriageById } = require('../models/triageModel');

const intakeSchema = z.object({
  patientId: z.string().uuid(),
  symptoms: z.array(z.string().min(2)).min(1),
  severity: z.enum(['low', 'medium', 'high']).default('low')
});

function determineRisk(severity, symptoms) {
  if (severity === 'high') return 'emergency';
  if (severity === 'medium') return symptoms.length > 3 ? 'grave' : 'moderado';
  return 'leve';
}

async function intake(req, res, next) {
  try {
    const data = intakeSchema.parse(req.body);
    const riskLevel = determineRisk(data.severity, data.symptoms);
    const recommendation = riskLevel === 'emergency'
      ? 'Procure atendimento de emergência imediatamente.'
      : 'Agende consulta com especialista adequado.';

    const triage = await createTriage({
      patientId: data.patientId,
      symptoms: data.symptoms,
      riskLevel,
      recommendation
    });

    return res.status(201).json({ triage });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const triage = await getTriageById(req.params.id);
    if (!triage) {
      return res.status(404).json({ error: 'not_found' });
    }
    return res.json({ triage });
  } catch (error) {
    return next(error);
  }
}

module.exports = { intake, getById };
