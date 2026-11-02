const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    genericName: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    strength: { type: String, required: true }, // e.g. "500 mg", "250 mg/5 ml"
    form: { type: String, enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Sachet', 'Ointment', 'Drops', 'Inhaler'], default: 'Tablet' },
    category: { type: String, default: 'General Healthcare' },
    uses: [{ type: String }],
    precautions: [{ type: String }],
    sideEffects: [{ type: String }],
    storage: { type: String, default: 'Store below 25°C in a dry place away from direct sunlight.' },
    prescriptionRequired: { type: Boolean, default: false },
    averagePrice: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

MedicineSchema.index({ name: 'text', genericName: 'text', brand: 'text' });

module.exports = mongoose.model('Medicine', MedicineSchema);
