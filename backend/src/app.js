const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFoundHandler, errorHandler } = require('./middleware/errors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const patientRoutes = require('./routes/patients');
const providerRoutes = require('./routes/providers');
const appointmentRoutes = require('./routes/appointments');
const triageRoutes = require('./routes/triage');
const telemedRoutes = require('./routes/telemed');

function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('combined'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'vitahub-backend' });
  });

  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/patients', patientRoutes);
  app.use('/providers', providerRoutes);
  app.use('/appointments', appointmentRoutes);
  app.use('/triage', triageRoutes);
  app.use('/telemed', telemedRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createServer };
