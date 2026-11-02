const express = require('express');
const router = express.Router();
const { getNearbyPharmacies, getPharmacyById } = require('../controllers/pharmacyController');

router.get('/nearby', getNearbyPharmacies);
router.get('/:id', getPharmacyById);

module.exports = router;
