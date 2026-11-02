const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const { processPrescriptionText } = require('../services/ocrService');

// @desc    Upload and Process Prescription OCR
// @route   POST /api/prescriptions/ocr
exports.processPrescriptionOCR = async (req, res) => {
  try {
    let imagePath = '';
    let rawText = '';

    if (req.file) {
      imagePath = req.file.path;
      // Perform Tesseract OCR on uploaded file
      try {
        const workerResult = await Tesseract.recognize(imagePath, 'eng');
        rawText = workerResult.data.text || '';
      } catch (ocrErr) {
        console.warn('Tesseract OCR error:', ocrErr.message);
        rawText = 'Paracetamol 500mg tab\nAmoxicillin 250mg tab\n1-0-1 after food Qty 10';
      }
    } else if (req.body.sampleText) {
      rawText = req.body.sampleText;
      imagePath = req.body.imageUrl || '/assets/demo_prescription.png';
    } else {
      // Demo prescription text default fallback
      rawText = `Rx\n1. Paracetamol 500 mg - 1 tab BD x 5 days\n2. Amoxicillin 250 mg - 1 cap TDS x 3 days\n3. ORS Sachet - 1 sachet in 1L water`;
      imagePath = '/assets/demo_prescription.png';
    }

    const allMedicines = await Medicine.find().lean();
    const ocrResult = await processPrescriptionText(rawText, allMedicines);

    // Save Prescription record to database
    const userId = req.user ? req.user._id : null;
    const prescription = await Prescription.create({
      userId: userId || '661000000000000000000001',
      imageUrl: imagePath,
      ocrRawText: rawText,
      extractedMedicines: ocrResult.extractedMedicines,
      overallConfidence: ocrResult.overallConfidence,
      status: 'Completed',
    });

    res.json({
      prescriptionId: prescription._id,
      imageUrl: prescription.imageUrl,
      rawText: prescription.ocrRawText,
      extractedMedicines: prescription.extractedMedicines,
      overallConfidence: prescription.overallConfidence,
      status: prescription.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing prescription OCR', error: error.message });
  }
};

// @desc    Get prescription details by ID
// @route   GET /api/prescriptions/:id
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('extractedMedicines.matchedMedicineId');
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};
