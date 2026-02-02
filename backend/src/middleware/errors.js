function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'not_found' });
  next();
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'internal_error' });
}

module.exports = { notFoundHandler, errorHandler };
