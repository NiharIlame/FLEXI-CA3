const express = require('express');
const { getDashboardStats } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/stats', getDashboardStats);

module.exports = router;
