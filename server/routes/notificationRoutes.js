const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, createRestockAlert } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/restock-alert', protect, createRestockAlert);

module.exports = router;
