const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/', protect, getReservations);
router.get('/:id', protect, getReservationById);
router.put('/:id/status', protect, updateReservationStatus);

module.exports = router;
