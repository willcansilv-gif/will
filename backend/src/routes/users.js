const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { me, list } = require('../controllers/userController');

const router = express.Router();

router.get('/me', authenticate, me);
router.get('/', authenticate, authorize(['admin']), list);

module.exports = router;
