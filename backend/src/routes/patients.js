const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { create, getById, list } = require('../controllers/patientController');

const router = express.Router();

router.post('/', authenticate, authorize(['admin']), create);
router.get('/', authenticate, authorize(['admin']), list);
router.get('/:id', authenticate, getById);

module.exports = router;
