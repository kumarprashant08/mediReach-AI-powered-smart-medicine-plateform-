// MediReach in-memory demo store.
// The attached 1,200-row medicine dataset is the source of truth for demo inventory.
const medicineDataset = require('../seed/medicineDataset.json');
const inventoryDataset = require('../seed/inventoryDataset.json');
const { pharmaciesData, reservationsData, notificationsData, demandData } = require('../seed/seedData');
const bcrypt = require('bcryptjs');

const uniqueBy = (items, key) => {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
};

const medicines = uniqueBy(medicineDataset, '_id').map(m => ({
  ...m,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const pharmacies = pharmaciesData.slice(0, 60).map((p, idx) => ({
  ...p,
  _id: `PHARM${String(idx + 1).padStart(3, '0')}`,
  isOpenNow: true,
  avgPickupMinutes: p.avgPickupMinutes || 15,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const pharmacyIds = new Set(pharmacies.map(p => p._id));
const inventory = inventoryDataset
  .filter(i => pharmacyIds.has(i.pharmacyId))
  .map(i => ({ ...i, lastUpdated: new Date(i.lastUpdated) }));

const demoPassword = bcrypt.hashSync('demo1234', 10);
const users = [
  {
    _id: 'user-demo-patient',
    name: 'Demo Patient',
    email: 'patient@medireach.demo',
    password: demoPassword,
    role: 'Patient',
    location: { address: 'Connaught Place, New Delhi', latitude: 28.6139, longitude: 77.2090 },
    pharmacyId: null,
  },
  {
    _id: 'user-demo-pharmacy',
    name: 'Demo Pharmacy Manager',
    email: 'pharmacy@medireach.demo',
    password: demoPassword,
    role: 'Pharmacy',
    pharmacyId: 'PHARM001',
    location: { address: pharmacies[0].address, latitude: pharmacies[0].latitude, longitude: pharmacies[0].longitude },
  },
  {
    _id: 'user-demo-admin',
    name: 'MediReach Admin',
    email: 'admin@medireach.demo',
    password: demoPassword,
    role: 'Admin',
    pharmacyId: null,
  },
];

const reservations = reservationsData || [];
const notifications = notificationsData || [];
const demand = demandData || [];

function generateInventory() {
  // Kept for backward compatibility. Dataset inventory is deterministic and is not regenerated.
  return inventory;
}

module.exports = {
  medicines,
  pharmacies,
  users,
  inventory,
  reservations,
  notifications,
  demand,
  generateInventory,
};
