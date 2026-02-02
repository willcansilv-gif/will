const express = require('express');
const { authenticate } = require('../middleware/auth');
const { intake, getById } = require('../controllers/triageController');

const router = express.Router();

router.post('/intake', authenticate, intake);
router.get('/:id', authenticate, getById);

module.exports = router;
