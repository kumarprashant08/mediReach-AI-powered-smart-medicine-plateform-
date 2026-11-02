import React from 'react';
import { Award, ShieldCheck, Cpu, Heart, CheckCircle2, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: 'Prashant Kumar', role: 'DATA Analytics , Full-Stack & AI Systems Lead', initial: 'P' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-brand-50 text-brand-600 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-brand-200">
          Smart Health Access Startup Product
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          About <span className="gradient-text">MediReach</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          MediReach bridges the gap between patient prescription needs, local pharmacy inventory opacity, and predictive medicine supply chain analytics.
        </p>
      </div>

      {/* Team Showcase Card */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-navy-900 flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-brand-500" /> Developed By TechBUDDIES
          </h2>
          <p className="text-xs text-slate-500">College Hackathon & Smart India Hackathon (SIH) Prototype Submission</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-400 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
                {member.initial}
              </div>
              <div>
                <h4 className="font-extrabold text-navy-900 text-base">{member.name}</h4>
                <p className="text-xs text-brand-600 font-semibold mt-1">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Architecture & Innovation Pillar */}
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-navy-900 text-center">Integrated Core Modules</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">1</div>
            <h4 className="font-extrabold text-navy-900 text-base">Prescription OCR</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Optical character recognition extracts medication names, strength, and dosage instructions directly from camera or file uploads.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">2</div>
            <h4 className="font-extrabold text-navy-900 text-base">Smart Access Ranking</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates normalized score (0-100) combining stock availability, distance, pricing, stock data freshness, and pickup queue speed.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">3</div>
            <h4 className="font-extrabold text-navy-900 text-base">Stockout Forecasting</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Predictive moving average model calculates estimated days until stockout and generates automated replenishment recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
