const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { processPrescriptionOCR, getPrescriptionById } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

// Multer storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `rx-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      return cb(new Error('Please upload an image file (jpg, png, webp)'));
    }
    cb(null, true);
  },
});

router.post('/ocr', upload.single('prescriptionImage'), processPrescriptionOCR);
router.get('/:id', getPrescriptionById);

module.exports = router;
