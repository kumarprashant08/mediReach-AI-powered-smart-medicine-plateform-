const mongoose = require('mongoose');

const ExtractedMedicineSchema = new mongoose.Schema({
  rawText: { type: String, required: true },
  matchedMedicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', default: null },
  matchedName: { type: String, default: '' },
  strength: { type: String, default: '' },
  dosageText: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  confidence: { type: Number, default: 85 }, // percentage 0-100
  userVerified: { type: Boolean, default: false },
});

const PrescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    ocrRawText: { type: String, default: '' },
    extractedMedicines: [ExtractedMedicineSchema],
    overallConfidence: { type: Number, default: 88 },
    status: { type: String, enum: ['Uploading', 'Processing', 'Completed', 'Failed'], default: 'Completed' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', PrescriptionSchema);
