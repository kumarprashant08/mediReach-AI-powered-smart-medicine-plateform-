import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pill, ShieldCheck, AlertCircle, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Medicine } from '../types';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [inStockCount, setInStockCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedicine() {
      if (!id) return;
      try {
        const data = await api.getMedicineById(id);
        setMedicine(data.medicine);
        setInStockCount(data.inStockPharmaciesCount || 0);
      } catch {
        setMedicine(null);
      } finally {
        setLoading(false);
      }
    }
    loadMedicine();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Loading medicine details...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-md mx-auto py-24 text-center glass-card rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-navy-900">Medicine Not Found</h3>
        <Link to="/medicines" className="text-xs text-brand-600 font-bold hover:underline">
          Return to Medicine Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/medicines" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-900">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {medicine.category}
            </span>
            <h1 className="text-3xl font-extrabold text-navy-900 mt-2">{medicine.name}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Brand: <strong className="text-navy-900">{medicine.brand}</strong> • Generic: <span className="text-slate-700">{medicine.genericName}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {medicine.prescriptionRequired ? (
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-lg">
                Prescription Required
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-lg">
                Over-the-Counter (OTC)
              </span>
            )}
            <span className="text-xl font-black text-navy-900">₹{medicine.averagePrice}</span>
          </div>
        </div>

        <MedicalDisclaimer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-navy-900 text-sm">Primary Educational Uses</h4>
            <ul className="space-y-1 text-slate-600">
              {medicine.uses?.map((use, idx) => (
                <li key={idx}>• {use}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-navy-900 text-sm">Precautions & Guidelines</h4>
            <ul className="space-y-1 text-slate-600">
              {medicine.precautions?.map((p, idx) => (
                <li key={idx}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-slate-600">Currently in stock at <strong className="text-navy-900">{inStockCount} local pharmacies</strong></span>
          </div>

          <Link
            to={`/pharmacies?medicineId=${medicine._id}`}
            className="bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" /> Find Nearby Pharmacies & Reserve
          </Link>
        </div>
      </div>
    </div>
  );
};
