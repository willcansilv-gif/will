const express = require('express');
const { authenticate } = require('../middleware/auth');
const { create, list, updateStatus } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', authenticate, create);
router.get('/', authenticate, list);
router.patch('/:id/status', authenticate, updateStatus);

module.exports = router;
