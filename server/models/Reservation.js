const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    pickupTime: { type: Date, required: true },
    reservationId: { type: String, required: true, unique: true }, // e.g. MR-2026-004281
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Ready for Pickup', 'Completed', 'Cancelled', 'Expired'],
      default: 'Confirmed',
    },
    qrPayload: { type: String, required: true },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', ReservationSchema);
