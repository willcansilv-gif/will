const { listUsers, findUserById } = require('../models/userModel');

async function me(req, res, next) {
  try {
    const user = await findUserById(req.user.id);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const users = await listUsers();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
}

module.exports = { me, list };
