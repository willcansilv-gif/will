const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { create, getById, list } = require('../controllers/providerController');

const router = express.Router();

router.post('/', authenticate, authorize(['admin']), create);
router.get('/', authenticate, list);
router.get('/:id', authenticate, getById);

module.exports = router;
