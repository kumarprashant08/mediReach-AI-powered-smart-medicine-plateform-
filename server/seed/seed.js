// server/seed/seed.js
// Run with: npm run seed
// This script connects to MongoDB (if available) and upserts demo data for medicines, pharmacies, users, inventory, reservations.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const DemandRecord = require('../models/DemandRecord');

const { medicinesData, pharmaciesData, usersData } = require('./seedData');

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medireach';

async function connect() {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed – aborting seed');
    process.exit(1);
  }
}

async function upsert(Model, docs, key = '_id') {
  for (const doc of docs) {
    const filter = {};
    filter[key] = doc[key];
    await Model.updateOne(filter, { $set: doc }, { upsert: true });
  }
}

async function seed() {
  await connect();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Medicine.deleteMany({}),
    Pharmacy.deleteMany({}),
    Inventory.deleteMany({}),
    Reservation.deleteMany({}),
    DemandRecord.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Insert medicines and pharmacies (seedData already contains IDs)
  const insertedMedicines = await Medicine.insertMany(medicinesData);
  const insertedPharmacies = await Pharmacy.insertMany(pharmaciesData);

  // Demo users (patient, pharmacy manager, admin)
  const salt = await bcrypt.genSalt(10);
  const pwdHash = await bcrypt.hash('demo1234', salt);

  const demoUsers = [
    { name: 'Demo Patient', email: 'patient@medireach.demo', password: pwdHash, role: 'Patient', location: { address: 'Connaught Place, New Delhi', latitude: 28.6139, longitude: 77.2090 } },
    { name: 'Demo Pharmacy Manager', email: 'pharmacy@medireach.demo', password: pwdHash, role: 'Pharmacy', pharmacyId: insertedPharmacies[0]._id, location: { address: insertedPharmacies[0].address, latitude: insertedPharmacies[0].latitude, longitude: insertedPharmacies[0].longitude } },
    { name: 'MediReach Admin', email: 'admin@medireach.demo', password: pwdHash, role: 'Admin' },
  ];

  const insertedUsers = await User.insertMany(demoUsers);

  // Generate realistic inventory (30‑70% of medicines per pharmacy, random stock & price)
  const inventoryDocs = [];
  const demandDocs = [];
  for (const pharmacy of insertedPharmacies) {
    const stockCount = Math.floor(insertedMedicines.length * (0.3 + Math.random() * 0.4));
    const shuffled = [...insertedMedicines].sort(() => Math.random() - 0.5);
    const selectedMeds = shuffled.slice(0, stockCount);
    for (const med of selectedMeds) {
      const qty = Math.floor(Math.random() * 101); // 0‑100 (0 = out of stock)
      const price = Math.round((med.averagePrice || 40) * (0.9 + Math.random() * 0.2));
      inventoryDocs.push({ pharmacyId: pharmacy._id, medicineId: med._id, quantity: qty, price, sku: `SKU-${pharmacy._id}-${med._id}`, lastUpdated: new Date() });

      // Demand history for past week
      for (let d = 6; d >= 0; d--) {
        const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
        const baseSales = med.category.includes('Antibiotics') ? 18 : 8;
        const sold = Math.max(1, Math.round(baseSales + (Math.random() * 8 - 4)));
        demandDocs.push({ medicineId: med._id, pharmacyId: pharmacy._id, date, quantitySold: sold, stock: qty + sold, searchesCount: sold * 2 + Math.floor(Math.random() * 5) });
      }
    }
  }
  await Inventory.insertMany(inventoryDocs);
  await DemandRecord.insertMany(demandDocs);

  // Create demo reservations for the patient
  const patient = insertedUsers.find(u => u.role === 'Patient');
  if (patient) {
    const reservationSamples = [];
    for (let i = 0; i < 30; i++) {
      const ph = insertedPharmacies[Math.floor(Math.random() * insertedPharmacies.length)];
      const med = insertedMedicines[Math.floor(Math.random() * insertedMedicines.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const reservationId = `MR-2026-${String(4281 + i).padStart(6, '0')}`;
      reservationSamples.push({ reservationId, userId: patient._id, pharmacyId: ph._id, medicineId: med._id, quantity: qty, unitPrice: med.averagePrice, totalPrice: med.averagePrice * qty, pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000), status: 'PENDING', qrPayload: JSON.stringify({ reservationId, user: patient.name, medicine: med.name, pharmacy: ph.name }) });
    }
    await Reservation.insertMany(reservationSamples);
  }

  console.log('✅ Seed completed');
  process.exit(0);
}

seed();
