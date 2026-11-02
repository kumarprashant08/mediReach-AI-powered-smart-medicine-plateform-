const mongoose = require('mongoose');

const RestockAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String, default: '' },
    },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RestockAlert', RestockAlertSchema);
