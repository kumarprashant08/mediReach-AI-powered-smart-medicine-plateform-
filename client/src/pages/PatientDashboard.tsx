import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  Clock,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Bookmark,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Reservation, PharmacyAccessResult } from '../types';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<PharmacyAccessResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const resData = await api.getReservations();
        setReservations(resData || []);

        const pharmData = await api.getNearbyPharmacies({ maxDistance: 10 });
        setNearbyPharmacies(pharmData || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeReservations = reservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Ready for Pickup'
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Good morning, {user ? user.name.split(' ')[0] : 'Patient'} 👋
          </h1>
          <p className="text-sm text-brand-100 leading-relaxed">
            Search verified medicines, check real-time stock across nearby pharmacies, and reserve your pickup instantly.
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine, brand or generic name..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full text-navy-900 bg-white text-sm focus:outline-none shadow-md"
              />
            </div>
            <button
              type="submit"
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{activeReservations.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Active Reservations</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">{nearbyPharmacies.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Nearby Pharmacies</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">4</span>
            <span className="text-xs text-slate-500 font-semibold">Recent Searches</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-navy-900">3</span>
            <span className="text-xs text-slate-500 font-semibold">Saved Medicines</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Reservations & Recommended Pharmacies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Reservations Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500" /> Active Reservations
            </h3>
            <Link to="/reservations" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeReservations.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl text-center text-slate-400 space-y-3">
              <p className="text-sm">No active reservations at the moment.</p>
              <Link
                to="/medicines"
                className="inline-block bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow"
              >
                Find & Reserve Medicine
              </Link>
            </div>
          ) : (
            activeReservations.map((res) => (
              <div
                key={res._id}
                className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                    {res.status}
                  </span>
                  <h4 className="font-bold text-navy-900 text-base mt-1">{res.medicineId?.name}</h4>
                  <p className="text-xs text-slate-500">{res.pharmacyId?.name} • Qty: {res.quantity}</p>
                  <p className="text-[11px] text-brand-600 font-semibold mt-1">ID: {res.reservationId}</p>
                </div>
                <Link
                  to={`/reservation/${res._id}`}
                  className="bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Recommended Nearby Pharmacies Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-500" /> Recommended Pharmacies
            </h3>
            <Link to="/pharmacies" className="text-xs font-bold text-brand-600 hover:underline">
              Map View
            </Link>
          </div>

          <div className="space-y-3">
            {nearbyPharmacies.slice(0, 3).map((item) => (
              <div
                key={item.pharmacy._id}
                className="glass-card p-4 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">{item.pharmacy.name}</h4>
                  <p className="text-xs text-slate-500">{item.distanceKm} km • {item.pharmacy.openingHours}</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                    Score {item.accessScore} / 100
                  </span>
                </div>
                <Link
                  to={`/pharmacies?id=${item.pharmacy._id}`}
                  className="text-xs text-brand-600 font-bold hover:underline"
                >
                  Visit →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
