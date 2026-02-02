const { z } = require('zod');
const { createUser, findUserByEmail } = require('../models/userModel');
const { hashPassword, comparePassword, createToken } = require('../utils/security');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['patient', 'provider', 'admin']),
  fullName: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await findUserByEmail(data.email);
    if (existing) {
      return res.status(409).json({ error: 'email_in_use' });
    }
    const passwordHash = await hashPassword(data.password);
    const user = await createUser({
      email: data.email,
      passwordHash,
      role: data.role,
      fullName: data.fullName
    });
    const token = createToken({ id: user.id, role: user.role });
    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await findUserByEmail(data.email);
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const match = await comparePassword(data.password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const token = createToken({ id: user.id, role: user.role });
    return res.json({ user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name }, token });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
