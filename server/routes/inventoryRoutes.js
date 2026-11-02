const express = require('express');
const router = express.Router();
const {
  getInventory,
  updateInventoryItem,
  bulkUpdateInventory,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getInventory);
router.put('/:id', protect, updateInventoryItem);
router.post('/bulk', protect, bulkUpdateInventory);

module.exports = router;
