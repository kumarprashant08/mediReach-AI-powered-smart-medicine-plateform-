const express = require('express');
const router = express.Router();
const {
  getMedicines,
  searchAutocomplete,
  getMedicineById,
  createMedicine,
} = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getMedicines);
router.get('/search', searchAutocomplete);
router.get('/:id', getMedicineById);
router.post('/', protect, authorize('Admin'), createMedicine);

module.exports = router;
