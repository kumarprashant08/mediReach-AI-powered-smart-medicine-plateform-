const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    sku: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

InventorySchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);
