const mongoose = require('mongoose');

// Demo mode forces use of the in‑memory data store.
const demoMode = process.env.DEMO_MODE === 'true';
let useInMemory = demoMode;

/**
 * Connect to MongoDB only when not in demo mode.
 * If DEMO_MODE is true we skip the connection entirely.
 */
const connectDB = async () => {
  if (demoMode) {
    console.log('[Demo Mode] Using in‑memory store (MongoDB skipped)');
    // No DB connection; callers can treat this as a failure to connect.
    return false;
  }
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medireach',
      { serverSelectionTimeoutMS: 2000 }
    );
    console.log('[MongoDB Connected]');
    useInMemory = false;
    return true;
  } catch (err) {
    console.warn('[MongoDB Unavailable] Falling fallback to in‑memory store:', err.message);
    useInMemory = true;
    return false;
  }
};

module.exports = { connectDB, useInMemory };
