const Fuse = require('fuse.js');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');

// @desc    Get all medicines with fuzzy search & filters
// @route   GET /api/medicines
exports.getMedicines = async (req, res) => {
  try {
    const { q, category, form, rxOnly, limit = 50 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (form) query.form = form;
    if (rxOnly === 'true') query.prescriptionRequired = true;
    if (rxOnly === 'false') query.prescriptionRequired = false;

    let medicines = await Medicine.find(query).limit(parseInt(limit)).lean();

    // Perform Fuzzy Search if query 'q' is provided
    if (q && q.trim().length > 0) {
      const fuse = new Fuse(medicines, {
        keys: ['name', 'genericName', 'brand', 'uses', 'category'],
        threshold: 0.45,
        ignoreLocation: true,
      });

      const results = fuse.search(q.trim());
      medicines = results.map((res) => res.item);
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

// @desc    Autocomplete medicine suggestions
// @route   GET /api/medicines/search?q=
exports.searchAutocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      const defaultMeds = await Medicine.find().limit(8).select('name brand strength category').lean();
      return res.json(defaultMeds);
    }

    const allMeds = await Medicine.find().select('name brand genericName strength category form').lean();
    const fuse = new Fuse(allMeds, {
      keys: ['name', 'genericName', 'brand'],
      threshold: 0.4,
    });

    const results = fuse.search(q.trim()).slice(0, 8);
    res.json(results.map((r) => r.item));
  } catch (error) {
    res.status(500).json({ message: 'Error in autocomplete search', error: error.message });
  }
};

// @desc    Get single medicine details by ID
// @route   GET /api/medicines/:id
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Fetch total inventory summary across all pharmacies
    const inventoryItems = await Inventory.find({ medicineId: medicine._id }).populate('pharmacyId');
    const inStockPharmaciesCount = inventoryItems.filter((item) => item.quantity > 0).length;

    res.json({
      medicine,
      inStockPharmaciesCount,
      totalPharmaciesTracked: inventoryItems.length,
      inventorySummary: inventoryItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine details', error: error.message });
  }
};

// @desc    Create new medicine (Admin or Demo)
// @route   POST /api/medicines
exports.createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create medicine', error: error.message });
  }
};
