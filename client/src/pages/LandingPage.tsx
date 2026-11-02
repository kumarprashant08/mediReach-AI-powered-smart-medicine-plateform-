import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  ShieldCheck,
  Zap,
  Award,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MediReachCore } from '../3d/MediReachCore';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const workflowSteps = [
    { num: '01', title: 'SEARCH / UPLOAD', desc: 'Type medicine or upload prescription OCR scan.', icon: Search },
    { num: '02', title: 'AI VERIFICATION', desc: 'Fuzzy matching aligns brands & generics.', icon: Sparkles },
    { num: '03', title: 'NEARBY AVAILABILITY', desc: 'Real-time stock from verified local pharmacies.', icon: MapPin },
    { num: '04', title: 'ACCESS RANKING', desc: 'Algorithms evaluate distance, price, & freshness.', icon: Award },
    { num: '05', title: 'RESERVE & PICKUP', desc: 'Instant QR code confirmation & route directions.', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION — the Home page opens directly into the interactive 3D MediReach experience */}
      <section id="home-hero" className="relative pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
                <span>Next-Gen Healthcare Availability Network</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]"
              >
                Find Your Medicine.{' '}
                <span className="gradient-text">Faster. Smarter. Nearby.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 max-w-2xl leading-relaxed"
              >
                AI-powered medicine search, prescription OCR understanding, verified live pharmacy stock, and stockout forecasting — unified in one platform.
              </motion.p>

              {/* Interactive Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSearchSubmit}
                className="glass-card p-2 rounded-full shadow-2xl border border-slate-200 flex items-center gap-2 max-w-xl"
              >
                <div className="pl-4 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicine, brand or generic (e.g. Paracetamol)..."
                  className="flex-1 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:text-slate-400 py-2.5"
                />
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-6 py-3 rounded-full shadow-glow transition-all hover:scale-105"
                >
                  Find Medicine
                </button>
              </motion.form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/prescription"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-xl transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-cyan-400" /> Upload Prescription OCR
                </Link>
                <Link
                  to="/pharmacies"
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-full border border-slate-200 shadow-md transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-brand-500" /> Discover Nearby Pharmacies
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5 text-navy-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> AI-Powered Matching
                </span>
                <span className="flex items-center gap-1.5 text-navy-900">
                  <Activity className="w-4 h-4 text-brand-500" /> Verified Real-Time Stock
                </span>
                <span className="flex items-center gap-1.5 text-navy-900">
                  <Award className="w-4 h-4 text-cyan-500" /> Smart Access Score
                </span>
                <span className="flex items-center gap-1.5 text-navy-900">
                  <Zap className="w-4 h-4 text-ai-purple" /> Instant Reservation
                </span>
              </div>
            </div>

            {/* Right 3D Visualizer Column */}
            <div className="lg:col-span-5 relative" aria-label="MediReach 3D healthcare animation">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 to-cyan-400/20 rounded-full blur-3xl opacity-60"></div>
              <MediReachCore />
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED WORKFLOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-600">
            End-To-End Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            How MediReach Solves Healthcare Access Friction
          </h3>
          <p className="text-slate-600 text-sm">
            From handwritten prescription capture to smart access ranking and reservation pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {workflowSteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-500/30">{step.num}</span>
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-bold text-navy-900 text-base mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* LIVE PHARMACY ACCESS RANKING PREVIEW */}
      <section className="bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950 text-white py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Smart Access Score Algorithm
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Don't Just Find Medicine. Find the Best Access Point.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              MediReach evaluates availability, real-time stock freshness, distance, pricing, and pickup waiting times into a single, normalized Smart Access Score (0-100).
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span><strong>40% Availability Score</strong> — Quantity in stock</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-400"></div>
                <span><strong>20% Distance Score</strong> — Proximity in kilometers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                <span><strong>15% Price Score</strong> — Competitive pricing vs regional avg</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ai-purple"></div>
                <span><strong>15% Freshness Score</strong> — Time since last inventory sync</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <span><strong>10% Pickup Score</strong> — Average waiting & queue duration</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/pharmacies"
                className="bg-gradient-to-r from-brand-500 to-cyan-400 text-navy-950 font-bold text-sm px-6 py-3 rounded-full hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                Explore Nearby Pharmacies <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {/* Simulated Live Pharmacy Card */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    🏆 98 Access Score • Best Recommendation
                  </span>
                  <h4 className="text-xl font-bold text-white mt-2">Apollo Pharmacy - Connaught Place</h4>
                  <p className="text-xs text-slate-300">1.2 km away • Open 24x7</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-navy-950/60 p-4 rounded-2xl text-xs border border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px]">Stock Status</span>
                  <span className="text-emerald-400 font-bold text-sm">In Stock (65 units)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Price</span>
                  <span className="text-white font-bold text-sm">₹42 / strip</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Last Sync</span>
                  <span className="text-cyan-300 font-semibold">2 min ago</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Est. Pickup</span>
                  <span className="text-white font-semibold">10 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600">
            Engineered By
          </span>
          <h3 className="text-3xl font-extrabold text-navy-900 mt-1">TechBUDDIES</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {['Prashant Kumar'].map((member, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-brand-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                {member.charAt(0)}
              </div>
              <h4 className="font-bold text-navy-900 text-sm">{member}</h4>
              <p className="text-xs text-brand-600 font-semibold mt-0.5">DATA ANALYTICS & WEB DEVELOPER</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
