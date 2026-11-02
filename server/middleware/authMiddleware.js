const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'medireach_super_secret_jwt_key_2026_hackathon';

const protect = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const { useInMemory } = require('../config/db');

    if (useInMemory) {
      const store = require('../services/inMemoryStore');
      const user = store.users.find(u => u._id === decoded.id || u.email === decoded.id);
      if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
      const { password, ...safeUser } = user;
      req.user = safeUser;
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
    return res.status(403).json({
      message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route`,
    });
  }
  next();
};

module.exports = { protect, authorize };
