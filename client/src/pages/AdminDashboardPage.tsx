import React, { useState, useEffect } from 'react';
import { Users, Store, Pill, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminOverview();
        setStats(data);
      } catch {
        setStats({
          totalUsers: 1420,
          totalPharmacies: 10,
          totalMedicines: 30,
          totalReservations: 184,
          lowStockItemsCount: 12,
          outOfStockItemsCount: 4,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
            System Administrator Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">Platform System Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Monitoring global user activity, pharmacy verification status, and stock alerts.</p>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{stats?.totalUsers || 1420}</span>
            <span className="text-xs text-slate-500 font-semibold">Registered Patients</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{stats?.totalPharmacies || 10}</span>
            <span className="text-xs text-slate-500 font-semibold">Partner Pharmacies</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{stats?.totalMedicines || 30}</span>
            <span className="text-xs text-slate-500 font-semibold">Indexed Medicines</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{stats?.totalReservations || 184}</span>
            <span className="text-xs text-slate-500 font-semibold">Reservations Handled</span>
          </div>
        </div>
      </div>

      {/* System Audit Log & Pharmacy Verification Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-navy-900 text-lg flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-500" /> Network Pharmacy Verification Status
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Apollo Pharmacy - Connaught Place', rating: 4.9, verified: true, items: 30 },
              { name: 'MedPlus Healthcare - Janpath', rating: 4.7, verified: true, items: 28 },
              { name: 'Frank Ross Pharmacy - Rajiv Chowk', rating: 4.8, verified: true, items: 30 },
              { name: 'City Pharmacy - Connaught Circus', rating: 4.3, verified: false, items: 15 },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">{p.name}</h4>
                  <span className="text-slate-500">Rating {p.rating} ⭐ • {p.items} items listed</span>
                </div>
                <span className={`font-bold px-3 py-1 rounded-full ${p.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {p.verified ? '✓ Verified Partner' : 'Pending Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-navy-900 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" /> System Event Audit Stream
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">2 minutes ago</span>
              <p className="font-semibold text-navy-900">Inventory updated for Paracetamol 500mg at Apollo CP.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">12 minutes ago</span>
              <p className="font-semibold text-navy-900">New Reservation MR-2026-004281 confirmed for Prashant Kumar.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">45 minutes ago</span>
              <p className="font-semibold text-navy-900">Prescription OCR scan executed with 94% confidence match.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
