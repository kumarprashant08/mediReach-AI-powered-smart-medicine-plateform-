const DemandRecord = require('../models/DemandRecord');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { generateDemandForecast } = require('../services/forecastingService');

// @desc    Get demand forecasting for a specific medicine and pharmacy
// @route   GET /api/analytics/demand
exports.getDemandForecast = async (req, res) => {
  try {
    const { medicineId, pharmacyId } = req.query;

    let filter = {};
    if (medicineId) filter.medicineId = medicineId;
    if (pharmacyId) filter.pharmacyId = pharmacyId;

    const historicalRecords = await DemandRecord.find(filter).sort({ date: 1 });

    // Fetch current inventory stock level
    let currentStock = 45;
    if (medicineId && pharmacyId) {
      const inv = await Inventory.findOne({ medicineId, pharmacyId });
      if (inv) currentStock = inv.quantity;
    }

    const forecast = generateDemandForecast(historicalRecords, currentStock);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating demand forecast', error: error.message });
  }
};

// @desc    Get stockout risk analysis across pharmacy inventory
// @route   GET /api/analytics/stockout
exports.getStockoutRisks = async (req, res) => {
  try {
    const { pharmacyId } = req.query;
    const targetPharmacyId = pharmacyId || (req.user && req.user.pharmacyId);

    let query = {};
    if (targetPharmacyId) {
      query.pharmacyId = targetPharmacyId;
    }

    const inventoryList = await Inventory.find(query)
      .populate('medicineId')
      .populate('pharmacyId');

    const stockoutRisks = [];

    for (const item of inventoryList) {
      if (!item.medicineId) continue;

      const historical = await DemandRecord.find({
        medicineId: item.medicineId._id,
        pharmacyId: item.pharmacyId._id,
      });

      const forecast = generateDemandForecast(historical, item.quantity);

      stockoutRisks.push({
        inventoryId: item._id,
        medicine: item.medicineId,
        pharmacy: item.pharmacyId,
        currentStock: item.quantity,
        price: item.price,
        avgDailyDemand: forecast.avgDailyDemand,
        predictedDailyDemand: forecast.predictedDailyDemand,
        stockoutDays: forecast.stockoutDays,
        riskLevel: forecast.riskLevel,
        recommendedReplenish: forecast.recommendedReplenish,
      });
    }

    // Sort by highest risk level first (HIGH > MEDIUM > LOW)
    const riskOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    stockoutRisks.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

    res.json(stockoutRisks);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating stockout risks', error: error.message });
  }
};

// @desc    Get system-wide overview statistics for Admin Dashboard
// @route   GET /api/analytics/overview
exports.getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'Patient' });
    const totalPharmacies = await Pharmacy.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const totalReservations = await Reservation.countDocuments();

    const lowStockItemsCount = await Inventory.countDocuments({ quantity: { $gt: 0, $lte: 10 } });
    const outOfStockItemsCount = await Inventory.countDocuments({ quantity: 0 });

    const recentReservations = await Reservation.find()
      .populate('medicineId', 'name')
      .populate('pharmacyId', 'name')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      totalUsers,
      totalPharmacies,
      totalMedicines,
      totalReservations,
      lowStockItemsCount,
      outOfStockItemsCount,
      recentReservations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview stats', error: error.message });
  }
};
