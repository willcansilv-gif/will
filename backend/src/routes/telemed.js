const express = require('express');
const { authenticate } = require('../middleware/auth');
const { create, getById } = require('../controllers/telemedController');

const router = express.Router();

router.post('/sessions', authenticate, create);
router.get('/sessions/:id', authenticate, getById);

module.exports = router;
