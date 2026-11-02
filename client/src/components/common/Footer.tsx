import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Heart, Github, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Vision */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
                Medi<span className="text-cyan-400">Reach</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered medicine information, prescription OCR, verified pharmacy availability and stockout risk prediction platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> DEMO MODE Active • Verified Engine
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/medicines" className="hover:text-cyan-400 transition-colors">Find Medicine</Link></li>
              <li><Link to="/prescription" className="hover:text-cyan-400 transition-colors">Prescription OCR Scanner</Link></li>
              <li><Link to="/pharmacies" className="hover:text-cyan-400 transition-colors">Nearby Pharmacies</Link></li>
              <li><Link to="/reservations" className="hover:text-cyan-400 transition-colors">Reservation System</Link></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/patient/dashboard" className="hover:text-cyan-400 transition-colors">Patient Dashboard</Link></li>
              <li><Link to="/pharmacy/dashboard" className="hover:text-cyan-400 transition-colors">Pharmacy Admin Console</Link></li>
              <li><Link to="/pharmacy/analytics" className="hover:text-cyan-400 transition-colors">Demand Forecasting Analytics</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-cyan-400 transition-colors">System Admin Overview</Link></li>
            </ul>
          </div>

          {/* Hackathon Team Credits */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Developed By
            </h4>
            <p className="text-xs text-slate-400 font-semibold mb-2">TechBUDDIES</p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Prashant Kumar</li>
              <li>• Yash Parmar</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <Link to="/about" className="text-xs text-brand-400 hover:underline font-semibold">
                Learn more about our vision →
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-slate-800/80 rounded-2xl p-4 mb-8 text-xs text-slate-400 border border-slate-700/60 leading-relaxed text-center">
          <strong className="text-white">Medical Advice Disclaimer:</strong> MediReach provides medicine informational data, verified local stock indexing, and access scores for educational and logistical purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician or pharmacist for medical decisions.
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800">
          <p>© 2026 MediReach Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Healthcare Accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};
