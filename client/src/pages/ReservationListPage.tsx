import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Clock, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Reservation } from '../types';

export const ReservationListPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      try {
        const data = await api.getReservations();
        setReservations(data || []);
      } catch {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    }
    loadReservations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">My Reservations</h1>
          <p className="text-xs text-slate-500 mt-1">Track active medicine bookings and pickup QR vouchers.</p>
        </div>
        <Link
          to="/medicines"
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all"
        >
          New Reservation
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Fetching reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-navy-900 text-base">No Reservations Found</h3>
          <p className="text-xs text-slate-500">You haven't reserved any medicines yet.</p>
          <Link to="/medicines" className="inline-block bg-brand-500 text-white font-bold text-xs px-4 py-2.5 rounded-full">
            Find Medicines
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div
              key={res._id}
              className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full">
                    {res.reservationId}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {res.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-navy-900 text-lg">{res.medicineId?.name}</h3>
                <p className="text-xs text-slate-500">{res.pharmacyId?.name} • Qty: {res.quantity} • Total: ₹{res.totalPrice}</p>
              </div>

              <Link
                to={`/reservation/${res._id}`}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 self-end sm:self-center"
              >
                View QR Voucher <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
