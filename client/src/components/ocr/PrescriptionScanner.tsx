import React, { useState } from 'react';
import { Upload, Camera, FileText, CheckCircle2, AlertCircle, RefreshCw, Search, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';

interface PrescriptionScannerProps {
  onMedicinesExtracted: (medicines: any[]) => void;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({ onMedicinesExtracted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState<'idle' | 'uploading' | 'reading' | 'extracting' | 'matching' | 'completed'>('idle');
  const [extractedResults, setExtractedResults] = useState<any[]>([]);
  const [overallConfidence, setOverallConfidence] = useState<number>(88);

  const samplePrescriptions = [
    {
      title: 'Sample Handwritten Prescription (Dr. Sharma)',
      text: 'Rx\n1. Paracetamol 500mg - 1 tab BD x 5 days\n2. Amoxicillin 250mg - 1 cap TDS x 3 days\n3. ORS Sachet - 1 sachet in 1L water',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    },
    {
      title: 'Sample Digital OPD Slip (Fortis Healthcare)',
      text: 'Rx\n1. Dolo 650 mg - 1 tab after food\n2. Pantoprazole 40mg - 1 tab OD before breakfast\n3. Cetirizine 10mg - 1 tab HS',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60',
    },
  ];

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const runOCR = async (overrideSampleText?: string, overrideImage?: string) => {
    setIsScanning(true);
    setScanStage('uploading');

    // Simulate animated scan pipeline steps for live hackathon demo feel
    setTimeout(() => setScanStage('reading'), 800);
    setTimeout(() => setScanStage('extracting'), 1600);
    setTimeout(() => setScanStage('matching'), 2400);

    try {
      let data;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('prescriptionImage', selectedFile);
        data = await api.processOCR(formData);
      } else {
        const textToProcess = overrideSampleText || samplePrescriptions[0].text;
        const imgToUse = overrideImage || samplePrescriptions[0].image;
        setPreviewUrl(imgToUse);

        const formData = new FormData();
        formData.append('sampleText', textToProcess);
        formData.append('imageUrl', imgToUse);
        data = await api.processOCR(formData);
      }

      setTimeout(() => {
        setScanStage('completed');
        setIsScanning(false);
        setExtractedResults(data.extractedMedicines || []);
        setOverallConfidence(data.overallConfidence || 88);
        onMedicinesExtracted(data.extractedMedicines || []);
      }, 3000);
    } catch {
      setIsScanning(false);
      setScanStage('idle');
    }
  };

  const handleEditMedicine = (index: number, newName: string, newStrength: string) => {
    const updated = [...extractedResults];
    updated[index].matchedName = newName;
    updated[index].strength = newStrength;
    updated[index].userVerified = true;
    setExtractedResults(updated);
    onMedicinesExtracted(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    const updated = extractedResults.filter((_, i) => i !== index);
    setExtractedResults(updated);
    onMedicinesExtracted(updated);
  };

  return (
    <div className="space-y-8">
      {/* Upload Drop Zone Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto mb-2 border border-brand-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900">Upload Prescription</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Drag and drop your doctor's prescription image or take a clear photo. Our AI OCR engine will automatically read, extract, and match verified medicines.
          </p>

          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 transition-colors bg-slate-50/50">
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="Prescription Preview" className="max-h-48 rounded-xl mx-auto shadow-md object-cover" />
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setScanStage('idle');
                      setExtractedResults([]);
                    }}
                    className="text-xs text-slate-500 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    Remove Image
                  </button>
                  <button
                    onClick={() => runOCR()}
                    disabled={isScanning}
                    className="bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    Rescan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center gap-3">
                  <label className="cursor-pointer bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    />
                  </label>
                </div>
                <span className="block text-xs text-slate-400">Supports JPG, PNG, WEBP up to 5MB</span>
              </div>
            )}
          </div>

          {/* Quick Sample Selector for Live Hackathon Demo */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Live Demo Quick Samples
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {samplePrescriptions.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => runOCR(sample.text, sample.image)}
                  disabled={isScanning}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-xs flex items-center gap-3 shadow-sm group"
                >
                  <img src={sample.image} alt="Sample" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div>
                    <span className="font-bold text-navy-900 block group-hover:text-brand-600 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-400">Click to run AI OCR</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated OCR Scan Pipeline */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 border border-brand-500/30 text-center space-y-6 bg-gradient-to-b from-brand-50/40 to-white"
        >
          <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-navy-900">Processing Prescription via AI OCR</h4>
            <p className="text-sm text-slate-500 mt-1">Reading text tokens and matching against medicine database...</p>
          </div>

          {/* Stage Step Progress Indicator */}
          <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-xl border ${scanStage === 'uploading' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 text-slate-500'}`}>
              1. Uploading
            </div>
            <div className={`p-2 rounded-xl border ${scanStage === 'reading' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 text-slate-500'}`}>
              2. Reading
            </div>
            <div className={`p-2 rounded-xl border ${scanStage === 'extracting' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 text-slate-500'}`}>
              3. Extracting
            </div>
            <div className={`p-2 rounded-xl border ${scanStage === 'matching' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 text-slate-500'}`}>
              4. Matching
            </div>
          </div>
        </motion.div>
      )}

      {/* Extracted Results Section */}
      {extractedResults.length > 0 && !isScanning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h4 className="text-xl font-bold text-navy-900">Extracted Prescription Medicines</h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">Review matched medicines before verifying local pharmacy stock.</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <span>Overall Match Confidence: {overallConfidence}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extractedResults.map((med, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-navy-900 text-base">{med.matchedName}</h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${med.confidence >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {med.confidence}% match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Strength: <strong className="text-slate-700">{med.strength}</strong></p>
                    <p className="text-xs text-slate-500">Dosage: <span className="text-slate-700">{med.dosageText}</span></p>
                    <p className="text-xs text-slate-500">Qty: <span className="text-slate-700">{med.quantity} units</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const newName = prompt('Edit Medicine Name:', med.matchedName);
                        if (newName) handleEditMedicine(idx, newName, med.strength);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Raw OCR text: "{med.rawText}"</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
