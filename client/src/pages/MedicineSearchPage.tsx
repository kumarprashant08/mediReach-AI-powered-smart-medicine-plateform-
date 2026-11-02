import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Pill, ShieldAlert, ChevronRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Medicine } from '../types';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const MedicineSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>('All');
  const [rxFilter, setRxFilter] = useState<string>('All');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<Medicine[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Analgesics & Antipyretics',
    'Antibiotics & Antimicrobials',
    'Antacids & Gastrointestinal',
    'Antiallergics & Respiratory',
    'Cardiovascular & Antidiabetic',
    'Vitamins & Supplements',
    'Pain Relief & Anti-inflammatories',
  ];

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const data = await api.getMedicines({
          q: query,
          category: category === 'All' ? undefined : category,
          rxOnly: rxFilter === 'Rx' ? true : rxFilter === 'OTC' ? false : undefined,
        });
        setMedicines(data || []);
      } catch {
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, category, rxFilter]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});

    if (val.trim().length >= 2) {
      const suggestions = await api.autocompleteMedicines(val);
      setAutocompleteSuggestions(suggestions);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Medicine Search & Verification Engine
        </h1>
        <p className="text-sm text-slate-600">
          Fuzzy spelling tolerance search across generic names, brands, strengths and therapeutic classes.
        </p>

        {/* Global Search Box with Autocomplete */}
        <div className="relative max-w-xl mx-auto pt-2">
          <div className="relative glass-card p-2 rounded-full border border-slate-300 shadow-xl flex items-center gap-2">
            <Search className="w-5 h-5 ml-3 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.trim().length >= 2 && setShowAutocomplete(true)}
              placeholder="Type medicine name (e.g. 'paracetmol', 'dolo')..."
              className="flex-1 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:text-slate-400 py-2"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                  setShowAutocomplete(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 px-3"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showAutocomplete && autocompleteSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 divide-y divide-slate-100">
              {autocompleteSuggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setQuery(item.name);
                    setSearchParams({ q: item.name });
                    setShowAutocomplete(false);
                  }}
                  className="p-3 hover:bg-brand-50 rounded-xl cursor-pointer flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <h5 className="font-bold text-sm text-navy-900">{item.name}</h5>
                    <span className="text-xs text-slate-500">{item.genericName} • {item.brand}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-600">{item.strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Educational Disclaimer */}
      <MedicalDisclaimer compact />

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rx vs OTC Segment Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-bold">
          {['All', 'OTC', 'Rx'].map((rx) => (
            <button
              key={rx}
              onClick={() => setRxFilter(rx)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                rxFilter === rx ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {rx === 'OTC' ? 'OTC (No Rx)' : rx === 'Rx' ? 'Prescription Required' : 'All Types'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Matching medicines across database...</p>
        </div>
      ) : medicines.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-navy-900 text-lg">No Medicines Matched</h3>
          <p className="text-xs text-slate-500">Try adjusting your spelling or reset category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div
              key={med._id}
              className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                      {med.category}
                    </span>
                    <h3 className="font-extrabold text-navy-900 text-lg mt-1 group-hover:text-brand-600 transition-colors">
                      {med.name}
                    </h3>
                  </div>
                  {med.prescriptionRequired ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md flex-shrink-0">
                      Rx Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex-shrink-0">
                      OTC
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Brand: <strong className="text-navy-900">{med.brand}</strong> • Generic:{' '}
                  <span className="text-slate-700">{med.genericName}</span>
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <span className="block font-semibold text-slate-700">Primary Uses:</span>
                  <div className="flex flex-wrap gap-1">
                    {med.uses?.map((use, idx) => (
                      <span key={idx} className="bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        • {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Regional Price</span>
                  <span className="text-lg font-black text-navy-900">₹{med.averagePrice}</span>
                </div>
                <Link
                  to={`/pharmacies?medicineId=${med._id}`}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
                >
                  Check Stock <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
