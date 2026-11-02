import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Filter,
  Award,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { PharmacyAccessResult, Medicine } from '../types';
import { PharmacyMap } from '../components/map/PharmacyMap';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const PharmacyDiscoveryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const medicineId = searchParams.get('medicineId');
  const navigate = useNavigate();
  const { userLocation } = useAuth();
  const { lastInventoryUpdate } = useSocket();

  const [pharmacies, setPharmacies] = useState<PharmacyAccessResult[]>([]);
  const [targetMedicine, setTargetMedicine] = useState<Medicine | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('accessScore');
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [safeRoute, setSafeRoute] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [pharmacyDetails, setPharmacyDetails] = useState<Record<string, any>>({});
  const [detailsLoading, setDetailsLoading] = useState<string | null>(null);

  // Reservation Modal State
  const [reservingItem, setReservingItem] = useState<PharmacyAccessResult | null>(null);
  const [reserveQty, setReserveQty] = useState(1);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (medicineId) {
          const medData = await api.getMedicineById(medicineId);
          setTargetMedicine(medData.medicine);
        }

        const data = await api.getNearbyPharmacies({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          medicineId: medicineId || undefined,
          openOnly,
          sortBy,
        });

        setPharmacies(data || []);
        if (data && data.length > 0) {
          const firstId = data[0].pharmacy._id;
          setSelectedPharmacyId(firstId);
          // When a patient arrives from medicine search, immediately calculate
          // a route to the best available pharmacy instead of making them click twice.
          if (medicineId) {
            try {
              const route = await api.getSafeRoute({
                lat: userLocation.latitude,
                lng: userLocation.longitude,
                pharmacyId: firstId,
                medicineId,
              });
              setSafeRoute(route);
            } catch {
              // Route remains available through the per-pharmacy Safe Route button.
            }
          }
        }
      } catch {
        setPharmacies([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = window.setInterval(loadData, 30000);
    return () => window.clearInterval(interval);
  }, [medicineId, sortBy, openOnly, userLocation, lastInventoryUpdate]);

  const handlePharmacySelect = async (pharmacyId: string) => {
    setSelectedPharmacyId(pharmacyId);
    if (pharmacyDetails[pharmacyId]) return;
    setDetailsLoading(pharmacyId);
    try {
      const details = await api.getPharmacyById(pharmacyId);
      setPharmacyDetails((prev) => ({ ...prev, [pharmacyId]: details }));
    } catch {
      // Keep the card usable even if detail loading fails.
    } finally {
      setDetailsLoading(null);
    }
  };

  const handleSafeRoute = async (pharmacyId: string) => {
    setRouteLoading(true);
    try {
      const route = await api.getSafeRoute({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        pharmacyId,
        medicineId: medicineId || undefined,
      });
      setSafeRoute(route);
      setSelectedPharmacyId(pharmacyId);
    } catch (err: any) {
      alert(err.message || 'Unable to calculate route');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!reservingItem || !reservingItem.inventory || !targetMedicine) return;

    setReserving(true);
    try {
      const res = await api.createReservation({
        pharmacyId: reservingItem.pharmacy._id,
        medicineId: targetMedicine._id,
        quantity: reserveQty,
      });

      setReservingItem(null);
      navigate(`/reservation/${res._id}`);
    } catch (err: any) {
      alert(err.message || 'Reservation failed');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            Real-Time Availability Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            {targetMedicine ? `Pharmacies Stocking ${targetMedicine.name}` : 'Nearby Verified Pharmacies'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing results ordered by <strong className="text-navy-900">Smart Access Score</strong> (proximity, price, availability & data freshness).
          </p>
        </div>

        {/* Sorting & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 px-3 py-2 rounded-full cursor-pointer">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="rounded text-brand-500"
            />
            Open Now Only
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-full text-navy-900 focus:outline-none"
          >
            <option value="accessScore">Sort by Smart Access Score</option>
            <option value="distance">Sort by Closest Distance</option>
            {medicineId && <option value="price">Sort by Lowest Price</option>}
          </select>
        </div>
      </div>

      {safeRoute && (
        <div className="glass-card p-5 rounded-3xl border border-violet-200 bg-violet-50/50 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <h2 className="font-extrabold text-navy-900">Safety-Aware Route Active</h2>
                {safeRoute.isNight && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-900 text-white">NIGHT MODE</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">{safeRoute.recommendation}</p>
              <p className="text-[10px] text-slate-400 mt-1">{safeRoute.safetyDisclaimer}</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div><strong className="text-xl text-violet-600">{safeRoute.safetyScore}</strong><span className="block text-[10px] text-slate-500">Safety-Aware Score</span></div>
              <div><strong className="text-xl text-navy-900">{safeRoute.distanceKm} km</strong><span className="block text-[10px] text-slate-500">Road Distance</span></div>
              <div><strong className="text-xl text-navy-900">{safeRoute.durationMinutes} min</strong><span className="block text-[10px] text-slate-500">ETA</span></div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${safeRoute.pharmacy.latitude},${safeRoute.pharmacy.longitude}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="bg-violet-600 text-white font-bold text-xs px-4 py-2.5 rounded-full"
              >
                Open Navigation
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Layout: Map + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-6 sticky top-24">
          <PharmacyMap
            userLat={userLocation.latitude}
            userLng={userLocation.longitude}
            pharmacies={pharmacies}
            selectedPharmacyId={selectedPharmacyId}
            onSelectPharmacy={(id) => handlePharmacySelect(id)}
            routeCoordinates={
              safeRoute?.geometry?.coordinates?.map((c: number[]) => [c[1], c[0]] as [number, number]) || []
            }
            routeLabel="MediReach Safety-Aware Route"
          />
        </div>

        {/* Right Column: Pharmacy Cards List */}
        <div className="lg:col-span-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Calculating Smart Access Scores...</p>
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl text-center text-slate-400">
              No pharmacies found matching filters.
            </div>
          ) : (
            pharmacies.map((item) => {
              const ph = item.pharmacy;
              const inv = item.inventory;
              const isSelected = selectedPharmacyId === ph._id;

              return (
                <div
                  key={ph._id}
                  onClick={() => handlePharmacySelect(ph._id)}
                  className={`glass-card p-6 rounded-3xl border transition-all duration-200 cursor-pointer ${
                    isSelected ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xl' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Top Badge: Smart Access Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {item.isTopRecommendation ? (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        🏆 Best Access Recommendation
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Score {item.accessScore} / 100
                      </span>
                    )}

                    <div className="text-right">
                      <span className="text-2xl font-black text-brand-600">{item.accessScore}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Access Score</span>
                    </div>
                  </div>

                  {/* Pharmacy Title & Details */}
                  <h3 className="font-extrabold text-navy-900 text-lg">{ph.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ph.address}</p>

                  {/* Highlights / Reasons */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {item.reasons.map((r, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                        {r}
                      </span>
                    ))}
                  </div>

                  {/* Stock & Pricing Breakdown if Medicine selected */}
                  {inv && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 my-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Medicine Price</span>
                        <strong className="text-base text-navy-900">₹{inv.price}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Stock Available</span>
                        <span className={`font-extrabold text-sm ${inv.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {inv.quantity > 0 ? `✓ In Stock (${inv.quantity} units)` : '✕ Out of Stock'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Confidence</span>
                        <span className="text-slate-700 font-bold">{item.confidenceScore}%</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pickup ~{ph.avgPickupMinutes} min
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSafeRoute(ph._id);
                        }}
                        disabled={routeLoading}
                        className="text-xs font-bold text-violet-700 hover:text-violet-900 border border-violet-200 bg-violet-50 px-3 py-2 rounded-full disabled:opacity-60"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                        {routeLoading ? 'Calculating…' : 'Safe Route'}
                      </button>
                      <a
                        href={`https://maps.google.com/?q=${ph.latitude},${ph.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-600 hover:text-navy-900 border border-slate-200 px-3 py-2 rounded-full"
                      >
                        Directions
                      </a>
                      {inv && inv.quantity > 0 && targetMedicine && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReservingItem(item);
                          }}
                          className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-md transition-all"
                        >
                          Reserve Medicine
                        </button>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-extrabold text-navy-900">Available Medicines at this Pharmacy</h4>
                        {detailsLoading === ph._id && <span className="text-[10px] text-slate-400">Loading…</span>}
                      </div>
                      {pharmacyDetails[ph._id]?.inventory?.length ? (
                        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                          {pharmacyDetails[ph._id].inventory.map((entry: any) => {
                            const med = entry.medicineId;
                            const available = Number(entry.quantity) > 0;
                            return (
                              <div key={entry._id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl p-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-navy-900 truncate">{med?.name || 'Medicine'}</p>
                                  <p className="text-[10px] text-slate-500">{med?.genericName || ''} {med?.strength ? `• ${med.strength}` : ''}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs font-extrabold text-navy-900">₹{entry.price}</p>
                                  <p className={`text-[10px] font-bold ${available ? 'text-emerald-600' : 'text-red-500'}`}>{available ? `${entry.quantity} in stock` : 'Out of stock'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : detailsLoading === ph._id ? null : (
                        <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">No inventory records are currently listed.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reservation Confirmation Modal */}
      {reservingItem && targetMedicine && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-navy-900 text-lg">Confirm Medicine Reservation</h3>
              <button onClick={() => setReservingItem(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-brand-50 p-3 rounded-2xl border border-brand-100">
                <span className="text-brand-600 font-bold block">{targetMedicine.name}</span>
                <span className="text-slate-600">{reservingItem.pharmacy.name}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReserveQty(Math.max(1, reserveQty - 1))}
                    className="w-7 h-7 rounded-full bg-slate-200 font-bold text-navy-900"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm">{reserveQty}</span>
                  <button
                    onClick={() => setReserveQty(Math.min(reservingItem.inventory?.quantity || 10, reserveQty + 1))}
                    className="w-7 h-7 rounded-full bg-slate-200 font-bold text-navy-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-2">
                <span>Total Amount:</span>
                <span className="text-brand-600 text-lg">
                  ₹{(reservingItem.inventory?.price || targetMedicine.averagePrice) * reserveQty}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmReservation}
              disabled={reserving}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm py-3.5 rounded-full shadow-lg transition-all"
            >
              {reserving ? 'Processing Reservation...' : 'Confirm & Generate QR Code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
