import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrescriptionScanner } from '../components/ocr/PrescriptionScanner';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const PrescriptionOCRPage: React.FC = () => {
  const [extractedMedicines, setExtractedMedicines] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearchAvailability = () => {
    if (extractedMedicines.length > 0) {
      const firstMedId = extractedMedicines[0].matchedMedicineId?._id || extractedMedicines[0].matchedMedicineId;
      if (firstMedId) {
        navigate(`/pharmacies?medicineId=${firstMedId}`);
      } else {
        navigate(`/pharmacies`);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="bg-ai-purple/10 text-ai-purple font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-ai-purple/20">
          AI Prescription Recognition
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Prescription OCR & Verification
        </h1>
        <p className="text-sm text-slate-600">
          Upload any printed or handwritten prescription. MediReach AI extracts medication names, strength, and dosage instructions automatically.
        </p>
      </div>

      <MedicalDisclaimer compact />

      {/* Main Scanner Container */}
      <PrescriptionScanner onMedicinesExtracted={(meds) => setExtractedMedicines(meds)} />

      {/* Find Nearby Availability Action Bar */}
      {extractedMedicines.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-600 to-cyan-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div>
            <h4 className="font-extrabold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> {extractedMedicines.length} Medicines Verified Ready for Lookup
            </h4>
            <p className="text-xs text-brand-100 mt-0.5">
              Check live stock levels and Smart Access Scores across nearby pharmacies now.
            </p>
          </div>
          <button
            onClick={handleSearchAvailability}
            className="bg-white text-navy-950 font-extrabold text-sm px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <MapPin className="w-4 h-4 text-brand-600" /> Find Nearby Pharmacies
          </button>
        </div>
      )}
    </div>
  );
};
