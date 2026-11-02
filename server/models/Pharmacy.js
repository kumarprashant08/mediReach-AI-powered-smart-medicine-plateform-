const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String, default: '' },
    email: { type: String, default: '' },
    openingHours: { type: String, default: '8:00 AM - 10:00 PM' },
    isOpenNow: { type: Boolean, default: true },
    verified: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    totalMedicines: { type: Number, default: 0 },
    avgPickupMinutes: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pharmacy', PharmacySchema);
