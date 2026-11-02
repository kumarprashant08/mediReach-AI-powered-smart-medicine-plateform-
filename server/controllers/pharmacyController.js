const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const { calculateAccessScore } = require('../services/accessScoreService');

// @desc    Get all pharmacies or nearby pharmacies for a specific medicine with Smart Access Scores
// @route   GET /api/pharmacies/nearby
exports.getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, medicineId, maxDistance = 15, openOnly, sortBy = 'accessScore' } = req.query;

    const userLat = parseFloat(lat) || 28.6139;
    const userLon = parseFloat(lng) || 77.2090;

    let pharmacyQuery = {};
    if (openOnly === 'true') {
      pharmacyQuery.isOpenNow = true;
    }

    const pharmacies = await Pharmacy.find(pharmacyQuery).lean();

    let results = [];

    if (medicineId) {
      const medicine = await Medicine.findById(medicineId);
      const inventoryList = await Inventory.find({ medicineId }).lean();
      const inventoryMap = new Map();
      inventoryList.forEach((inv) => inventoryMap.set(inv.pharmacyId.toString(), inv));

      for (const ph of pharmacies) {
        const invItem = inventoryMap.get(ph._id.toString()) || {
          quantity: 0,
          price: medicine ? medicine.averagePrice || 45 : 45,
          lastUpdated: new Date(Date.now() - 3600 * 1000 * 24),
        };

        const accessScoreData = calculateAccessScore(
          ph,
          invItem,
          userLat,
          userLon,
          medicine ? medicine.averagePrice : 50
        );

        if (accessScoreData.distanceKm <= parseFloat(maxDistance)) {
          results.push({
            pharmacy: ph,
            inventory: invItem,
            medicine,
            accessScore: accessScoreData.accessScore,
            distanceKm: accessScoreData.distanceKm,
            status: accessScoreData.status,
            confidenceScore: accessScoreData.confidenceScore,
            reasons: accessScoreData.reasons,
            scoreBreakdown: {
              availabilityScore: accessScoreData.availabilityScore,
              distanceScore: accessScoreData.distanceScore,
              priceScore: accessScoreData.priceScore,
              freshnessScore: accessScoreData.freshnessScore,
              pickupScore: accessScoreData.pickupScore,
            },
          });
        }
      }
    } else {
      // General pharmacy lookup without specific medicine
      for (const ph of pharmacies) {
        const dummyInv = { quantity: 50, price: 40, lastUpdated: new Date() };
        const accessScoreData = calculateAccessScore(ph, dummyInv, userLat, userLon);

        if (accessScoreData.distanceKm <= parseFloat(maxDistance)) {
          results.push({
            pharmacy: ph,
            inventory: null,
            accessScore: accessScoreData.accessScore,
            distanceKm: accessScoreData.distanceKm,
            status: 'Operational',
            reasons: accessScoreData.reasons,
          });
        }
      }
    }

    // Sort results according to user criteria
    if (sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'price' && medicineId) {
      results.sort((a, b) => (a.inventory?.price || 0) - (b.inventory?.price || 0));
    } else {
      // Default: sort by highest Smart Access Score
      results.sort((a, b) => b.accessScore - a.accessScore);
    }

    // Tag the top recommended option
    if (results.length > 0) {
      results[0].isTopRecommendation = true;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error discovering nearby pharmacies', error: error.message });
  }
};

// @desc    Get pharmacy by ID and its complete inventory
// @route   GET /api/pharmacies/:id
exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const inventory = await Inventory.find({ pharmacyId: pharmacy._id }).populate('medicineId');

    res.json({
      pharmacy,
      inventory,
      totalMedicines: inventory.length,
      inStockCount: inventory.filter((i) => i.quantity > 0).length,
      outOfStockCount: inventory.filter((i) => i.quantity === 0).length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pharmacy details', error: error.message });
  }
};
