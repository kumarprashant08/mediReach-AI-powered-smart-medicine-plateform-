const mongoose = require('mongoose');

const DemandRecordSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    date: { type: Date, required: true },
    quantitySold: { type: Number, required: true },
    stock: { type: Number, required: true },
    searchesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DemandRecordSchema.index({ medicineId: 1, pharmacyId: 1, date: 1 });

module.exports = mongoose.model('DemandRecord', DemandRecordSchema);
