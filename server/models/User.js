const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Patient', 'Pharmacy', 'Admin'], default: 'Patient' },
    location: {
      address: { type: String, default: '' },
      latitude: { type: Number, default: 28.6139 }, // Default New Delhi coordinates for demo
      longitude: { type: Number, default: 77.2090 },
    },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
