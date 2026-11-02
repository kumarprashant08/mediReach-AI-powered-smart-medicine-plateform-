const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medireach_super_secret_jwt_key_2026_hackathon', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, address, latitude, longitude } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let pharmacyId = null;

    // If registering as a Pharmacy, automatically create linked Pharmacy profile
    if (role === 'Pharmacy') {
      const newPharmacy = await Pharmacy.create({
        name: name.includes('Pharmacy') ? name : `${name} Pharmacy`,
        address: address || '123 Health Street, City Center',
        latitude: latitude || 28.6139,
        longitude: longitude || 77.2090,
        phone: '+91 98765 43210',
        openingHours: '8:00 AM - 10:00 PM',
        verified: true,
      });
      pharmacyId = newPharmacy._id;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Patient',
      location: {
        address: address || 'New Delhi, India',
        latitude: latitude || 28.6139,
        longitude: longitude || 77.2090,
      },
      pharmacyId,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      pharmacyId: user.pharmacyId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('pharmacyId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      pharmacyId: user.pharmacyId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('pharmacyId');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};
