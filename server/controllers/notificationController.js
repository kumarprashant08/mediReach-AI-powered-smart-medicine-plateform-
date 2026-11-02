const Notification = require('../models/Notification');
const RestockAlert = require('../models/RestockAlert');

// @desc    Get user notifications
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : '661000000000000000000001';
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// @desc    Create a restock alert for an out-of-stock medicine
// @route   POST /api/notifications/restock-alert
exports.createRestockAlert = async (req, res) => {
  try {
    const { medicineId, latitude, longitude, address } = req.body;
    const userId = req.user ? req.user._id : '661000000000000000000001';

    const alert = await RestockAlert.create({
      userId,
      medicineId,
      location: { latitude, longitude, address },
      active: true,
    });

    res.status(201).json({ message: 'Restock notification subscribed successfully', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error setting restock alert', error: error.message });
  }
};
