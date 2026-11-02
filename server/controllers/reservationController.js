const Reservation = require('../models/Reservation');
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

// Generate unique Reservation ID e.g. MR-2026-004281
function generateReservationId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MR-2026-${randomNum}`;
}

// @desc    Create a new medicine reservation
// @route   POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { pharmacyId, medicineId, quantity = 1, pickupTime, notes } = req.body;

    const userId = req.user ? req.user._id : '661000000000000000000001';

    const inventory = await Inventory.findOne({ pharmacyId, medicineId });
    if (!inventory) {
      return res.status(404).json({ message: 'Medicine is not listed in this pharmacy inventory' });
    }

    if (inventory.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${inventory.quantity} units remaining.`,
      });
    }

    const medicine = await Medicine.findById(medicineId);
    const pharmacy = await Pharmacy.findById(pharmacyId);

    const unitPrice = inventory.price;
    const totalPrice = unitPrice * quantity;
    const resId = generateReservationId();
    const targetPickupTime = pickupTime ? new Date(pickupTime) : new Date(Date.now() + 3600 * 1000 * 2); // Default 2 hrs from now

    // QR payload contains verification JSON string
    const qrPayload = JSON.stringify({
      reservationId: resId,
      userId,
      medicineName: medicine.name,
      pharmacyName: pharmacy.name,
      quantity,
      totalPrice,
      validUntil: targetPickupTime,
    });

    const reservation = await Reservation.create({
      userId,
      pharmacyId,
      medicineId,
      quantity,
      unitPrice,
      totalPrice,
      pickupTime: targetPickupTime,
      reservationId: resId,
      status: 'Confirmed',
      qrPayload,
      notes: notes || '',
    });

    // Deduct stock from inventory
    inventory.quantity = Math.max(0, inventory.quantity - quantity);
    inventory.lastUpdated = new Date();
    await inventory.save();

    // Create Notification for Patient
    await Notification.create({
      userId,
      type: 'ReservationConfirmed',
      title: 'Reservation Confirmed! 🎉',
      message: `Your reservation ${resId} for ${medicine.name} at ${pharmacy.name} is confirmed for pickup.`,
      link: `/reservation/${reservation._id}`,
    });

    // Emit Socket.io event for real-time inventory update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('inventoryUpdated', {
        pharmacyId,
        medicineId,
        quantity: inventory.quantity,
        price: inventory.price,
        lastUpdated: inventory.lastUpdated,
      });
      io.emit('newReservation', { reservationId: resId, pharmacyId });
    }

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
};

// @desc    Get user reservations or pharmacy reservations
// @route   GET /api/reservations
exports.getReservations = async (req, res) => {
  try {
    let filter = {};

    if (req.user) {
      if (req.user.role === 'Pharmacy' && req.user.pharmacyId) {
        filter.pharmacyId = req.user.pharmacyId;
      } else if (req.user.role === 'Patient') {
        filter.userId = req.user._id;
      }
    }

    const reservations = await Reservation.find(filter)
      .populate('medicineId')
      .populate('pharmacyId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// @desc    Get single reservation by ID or reservation code
// @route   GET /api/reservations/:id
exports.getReservationById = async (req, res) => {
  try {
    let reservation;
    if (req.params.id.startsWith('MR-')) {
      reservation = await Reservation.findOne({ reservationId: req.params.id })
        .populate('medicineId')
        .populate('pharmacyId')
        .populate('userId', 'name email');
    } else {
      reservation = await Reservation.findById(req.params.id)
        .populate('medicineId')
        .populate('pharmacyId')
        .populate('userId', 'name email');
    }

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservation', error: error.message });
  }
};

// @desc    Cancel or Update status of reservation
// @route   PUT /api/reservations/:id/status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Ready for Pickup', 'Completed', 'Cancelled'
    const reservation = await Reservation.findById(req.params.id).populate('medicineId pharmacyId');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const oldStatus = reservation.status;
    reservation.status = status;
    await reservation.save();

    // If cancelled, restore inventory
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      const inventory = await Inventory.findOne({
        pharmacyId: reservation.pharmacyId._id,
        medicineId: reservation.medicineId._id,
      });

      if (inventory) {
        inventory.quantity += reservation.quantity;
        inventory.lastUpdated = new Date();
        await inventory.save();
      }
    }

    // Send notification
    await Notification.create({
      userId: reservation.userId,
      type: status === 'Cancelled' ? 'ReservationCancelled' : 'ReadyForPickup',
      title: `Reservation ${status}`,
      message: `Your reservation ${reservation.reservationId} for ${reservation.medicineId.name} is now ${status}.`,
      link: `/reservation/${reservation._id}`,
    });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation status', error: error.message });
  }
};
