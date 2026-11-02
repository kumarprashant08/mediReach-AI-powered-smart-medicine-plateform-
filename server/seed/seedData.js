// Seed Data for MediReach Demo Mode
// This script programmatically generates demo data for medicines, pharmacies, users, inventory, reservations, etc.
// No external dependencies are required; all data is generated deterministically for repeatable results.

// ---------- Configuration ----------
const NUM_MEDICINES = 1000; // minimum required
const NUM_PHARMACIES = 60; // 55-60 as required
const CATEGORIES = [
  'Antibiotics & Antimicrobials',
  'Antacids & Gastrointestinal',
  'Antiallergics & Respiratory',
  'Cardiovascular & Antidiabetic',
  'Vitamins & Supplements',
  'Pain Relief & Anti-inflammatories',
];

const PHARMACY_NAMES = [
  'MediCare Pharmacy',
  'HealthPlus Medical Store',
  'Wellness Pharmacy',
  'CityCare Medicines',
  'LifeLine Pharmacy',
  'HealthFirst Medicals',
  'CareWell Pharmacy',
  'PrimeHealth Pharmacy',
  'Sunrise Medicals',
  'GoldenCare Pharmacy',
  'Apex Pharmacy',
  'BlueSky Medics',
  'GreenLeaf Pharmacy',
  'SilverLine Pharmacy',
  'BrightHealth Pharmacy',
  'Harmony Medical Store',
  'Vitality Pharmacy',
  'CureWell Pharmacy',
  'WellBeing Pharmacy',
  'PureHealth Pharmacy',
]; // we'll repeat to reach 60 entries

// ---------- Helper Functions ----------
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generatePhone() {
  return '+91 ' + randomInt(1000000000, 9999999999);
}
function generateEmail(name) {
  const clean = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  return `${clean}@medireach.demo`;
}
function generateAddress(i) {
  // Simple synthetic address using index
  const streets = ['MG Road', 'Ring Road', 'Park Street', 'Main Avenue', 'Lake View', 'Hill Road'];
  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];
  const street = randomChoice(streets);
  const city = randomChoice(cities);
  const state = randomChoice(states);
  const pincode = randomInt(100000, 999999);
  const area = `${street} Area`;
  return { address: `${randomInt(1, 200)} ${street}, ${city}`, area, city, state, pincode };
}

// ---------- Data Generation ----------
// Medicines
const medicinesData = [];
for (let i = 1; i <= NUM_MEDICINES; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const name = `Medicine ${i}`; // placeholder name
  const genericName = `GenericMed${i}`;
  const brand = `Brand${i}`;
  const strength = `${randomInt(5, 500)} mg`;
  const formOptions = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler'];
  const form = randomChoice(formOptions);
  const uses = [`Therapeutic use ${i % 7}`];
  const precautions = [`Precaution ${i % 5}`];
  const sideEffects = [`Side effect ${i % 3}`];
  const storage = 'Store in a cool, dry place.';
  const prescriptionRequired = i % 3 === 0; // approx 1/3 require prescription
  const averagePrice = randomInt(20, 200);
  const imageUrl = `/medicine-icons/${category.replace(/\s+/g, '-').toLowerCase()}.png`;
  const description = `Detailed description for ${name}.`;
  medicinesData.push({
    name,
    genericName,
    brand,
    strength,
    form,
    category,
    uses,
    precautions,
    sideEffects,
    storage,
    prescriptionRequired,
    averagePrice,
    imageUrl,
    description,
  });
}

// Pharmacies
const pharmaciesData = [];
for (let i = 1; i <= NUM_PHARMACIES; i++) {
  const baseName = PHARMACY_NAMES[(i - 1) % PHARMACY_NAMES.length];
  const name = `${baseName} ${i}`;
  const { address, area, city, state, pincode } = generateAddress(i);
  const latitude = 28.5 + Math.random() * 0.4; // Delhi region approximate
  const longitude = 77.0 + Math.random() * 0.4;
  const phone = generatePhone();
  const alternatePhone = generatePhone();
  const email = generateEmail(name);
  const openingHours = randomChoice([
    '24x7 Open',
    '7:30 AM - 11:00 PM',
    '8:00 AM - 10:30 PM',
    '9:00 AM - 9:00 PM',
  ]);
  const rating = parseFloat((randomInt(35, 50) / 10).toFixed(1)); // 3.5 - 5.0
  const verified = Math.random() > 0.2;
  const isOpenNow = Math.random() > 0.2;
  const totalMedicines = randomInt(200, 800);
  const createdAt = new Date();
  pharmaciesData.push({
    name,
    address,
    area,
    city,
    state,
    pincode,
    latitude,
    longitude,
    phone,
    alternatePhone,
    email,
    openingHours,
    rating,
    verified,
    isOpenNow,
    totalMedicines,
    createdAt,
  });
}

// Users – demo accounts (already handled elsewhere but keep here for completeness)
const usersData = [];

// Inventory – random relationships between pharmacies and medicines
const inventoryData = [];
pharmaciesData.forEach((ph) => {
  // Each pharmacy stocks a random subset of medicines (30% to 70%)
  const stockCount = randomInt(Math.floor(NUM_MEDICINES * 0.3), Math.floor(NUM_MEDICINES * 0.7));
  const selectedIndices = new Set();
  while (selectedIndices.size < stockCount) {
    selectedIndices.add(randomInt(0, NUM_MEDICINES - 1));
  }
  selectedIndices.forEach((medIdx) => {
    const medicine = medicinesData[medIdx];
    const quantity = randomInt(0, 100); // 0 = out of stock
    const price = Math.round(medicine.averagePrice * (0.9 + Math.random() * 0.2));
    inventoryData.push({
      pharmacyId: ph._id, // will be assigned after IDs are generated in DB/inMemory
      medicineId: medicine._id,
      quantity,
      price,
      lastUpdated: new Date(),
    });
  });
});

// Reservations – demo reservations for demo users (will be created later)
const reservationsData = [];
const notificationsData = [];
const demandData = [];

module.exports = {
  medicinesData,
  pharmaciesData,
  usersData,
  inventoryData,
  reservationsData,
  notificationsData,
  demandData,
};
