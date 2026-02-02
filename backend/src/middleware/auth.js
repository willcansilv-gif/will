const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'vitahub_secret');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
