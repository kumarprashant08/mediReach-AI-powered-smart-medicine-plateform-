const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');
const RestockAlert = require('../models/RestockAlert');
const Notification = require('../models/Notification');

// @desc    Get pharmacy inventory items
// @route   GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const { pharmacyId } = req.query;
    const targetPharmacyId = pharmacyId || (req.user && req.user.pharmacyId);

    if (!targetPharmacyId) {
      return res.status(400).json({ message: 'Pharmacy ID is required' });
    }

    const inventory = await Inventory.find({ pharmacyId: targetPharmacyId })
      .populate('medicineId')
      .sort({ lastUpdated: -1 });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

// @desc    Update single inventory item stock / price
// @route   PUT /api/inventory/:id
exports.updateInventoryItem = async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const inventoryItem = await Inventory.findById(req.params.id).populate('medicineId pharmacyId');

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }

    const oldQuantity = inventoryItem.quantity;
    if (quantity !== undefined) inventoryItem.quantity = Math.max(0, parseInt(quantity, 10));
    if (price !== undefined) inventoryItem.price = parseFloat(price);

    inventoryItem.lastUpdated = new Date();
    await inventoryItem.save();

    // Check if stock transitioned from 0 -> >0 (Back in stock)
    if (oldQuantity === 0 && inventoryItem.quantity > 0) {
      // Find active restock alerts for this medicine
      const alerts = await RestockAlert.find({
        medicineId: inventoryItem.medicineId._id,
        active: true,
      });

      for (const alert of alerts) {
        await Notification.create({
          userId: alert.userId,
          type: 'BackInStock',
          title: 'Medicine Back in Stock! 💊',
          message: `${inventoryItem.medicineId.name} is now back in stock at ${inventoryItem.pharmacyId.name}. Reserve your pickup now!`,
          link: `/medicine/${inventoryItem.medicineId._id}`,
        });
        alert.active = false;
        await alert.save();
      }
    }

    // Emit Socket.io event for real-time live update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('inventoryUpdated', {
        pharmacyId: inventoryItem.pharmacyId._id,
        medicineId: inventoryItem.medicineId._id,
        quantity: inventoryItem.quantity,
        price: inventoryItem.price,
        lastUpdated: inventoryItem.lastUpdated,
      });
    }

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
};

// @desc    Bulk update inventory quantities
// @route   POST /api/inventory/bulk
exports.bulkUpdateInventory = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { inventoryId, quantity, price }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Updates array is required' });
    }

    const updatedItems = [];
    for (const update of updates) {
      const item = await Inventory.findById(update.inventoryId);
      if (item) {
        if (update.quantity !== undefined) item.quantity = Math.max(0, parseInt(update.quantity, 10));
        if (update.price !== undefined) item.price = parseFloat(update.price);
        item.lastUpdated = new Date();
        await item.save();
        updatedItems.push(item);
      }
    }

    // Emit bulk update socket event
    const io = req.app.get('socketio');
    if (io) {
      io.emit('inventoryBulkUpdated', { timestamp: new Date() });
    }

    res.json({ message: `Successfully updated ${updatedItems.length} items`, updatedItems });
  } catch (error) {
    res.status(500).json({ message: 'Error in bulk inventory update', error: error.message });
  }
};
