import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div
      className={`bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900 flex items-start gap-3 ${
        compact ? 'text-xs py-3' : 'text-sm my-6'
      }`}
    >
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <strong className="font-bold text-amber-900 block mb-0.5">Medical Information Disclaimer</strong>
        This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician or licensed pharmacist before starting or modifying any medication.
      </div>
    </div>
  );
};
