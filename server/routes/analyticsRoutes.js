const express = require('express');
const router = express.Router();
const {
  getDemandForecast,
  getStockoutRisks,
  getOverviewStats,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/demand', getDemandForecast);
router.get('/stockout', getStockoutRisks);
router.get('/overview', protect, getOverviewStats);

module.exports = router;
