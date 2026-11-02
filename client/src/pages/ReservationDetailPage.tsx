import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, MapPin, Clock, Navigation, ArrowLeft, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Reservation } from '../types';

export const ReservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRes() {
      if (!id) return;
      try {
        const data = await api.getReservationById(id);
        setReservation(data);

        // Trigger confetti celebration on fresh confirmation
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        setReservation(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRes();
  }, [id]);

  const handleCancel = async () => {
    if (!reservation || !confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const updated = await api.updateReservationStatus(reservation._id, 'Cancelled');
      setReservation(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Loading reservation details...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-md mx-auto py-24 text-center glass-card rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-navy-900">Reservation Not Found</h3>
        <Link to="/reservations" className="text-xs text-brand-600 font-bold hover:underline">
          Return to Reservations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/reservations" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-900">
        <ArrowLeft className="w-4 h-4" /> Back to My Reservations
      </Link>

      {/* Reservation Ticket Card */}
      <div className="glass-card bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-cyan-500 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Verified Reservation Voucher
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{reservation.reservationId}</h1>
            <p className="text-xs text-brand-100 mt-0.5">
              Booked on {new Date(reservation.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white text-navy-900 px-4 py-2 rounded-2xl text-xs font-extrabold text-center shadow-md">
            Status: <span className="text-brand-600 uppercase">{reservation.status}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* QR Code Column */}
          <div className="md:col-span-5 text-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="bg-white p-4 rounded-xl inline-block border border-slate-200 shadow-inner">
              <QRCodeSVG value={reservation.qrPayload || reservation.reservationId} size={160} />
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Show this QR code at pharmacy counter for instant pickup verification.
            </p>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 space-y-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Reserved Medication</span>
              <h3 className="font-extrabold text-navy-900 text-lg">{reservation.medicineId?.name}</h3>
              <p className="text-slate-500">{reservation.medicineId?.brand} • {reservation.medicineId?.strength}</p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Pickup Pharmacy</span>
              <h4 className="font-bold text-navy-900 text-sm mt-0.5">{reservation.pharmacyId?.name}</h4>
              <p className="text-slate-500">{reservation.pharmacyId?.address}</p>
              <p className="text-brand-600 font-semibold mt-0.5">Phone: {reservation.pharmacyId?.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-brand-50/60 p-3 rounded-xl border border-brand-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Quantity</span>
                <strong className="text-navy-900 text-sm">{reservation.quantity} units</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Price</span>
                <strong className="text-brand-600 text-sm">₹{reservation.totalPrice}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`https://maps.google.com/?q=${reservation.pharmacyId?.latitude},${reservation.pharmacyId?.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>

              {reservation.status === 'Confirmed' && (
                <button
                  onClick={handleCancel}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Cancel Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
