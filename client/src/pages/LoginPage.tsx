
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pill,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Patient' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const demoAccounts = [
    { label: 'Patient Demo', email: 'patient@medireach.demo', icon: '🧑‍⚕️', color: 'from-brand-600 to-cyan-500' },
    { label: 'Pharmacy Demo', email: 'pharmacy@medireach.demo', icon: '🏪', color: 'from-emerald-600 to-teal-500' },
    { label: 'Admin Demo', email: 'admin@medireach.demo', icon: '🛡️', color: 'from-purple-600 to-indigo-500' },
  ];

  const handleQuickLogin = async (email: string) => {
    setLoading(true);
    try {
      const user = await login(email, 'demo1234');
      showToast('Logged In!', `Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      navigate(user.role === 'Pharmacy' ? '/pharmacy/dashboard' : user.role === 'Admin' ? '/admin/dashboard' : '/patient/dashboard');
    } catch {
      showToast('Login Failed', 'Please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
        showToast('Welcome back!', `Logged in as ${user.name}`, 'success');
      } else {
        user = await register(form);
        showToast('Account Created!', `Welcome to MediReach, ${user.name}!`, 'success');
      }
      navigate(user.role === 'Pharmacy' ? '/pharmacy/dashboard' : user.role === 'Admin' ? '/admin/dashboard' : '/patient/dashboard');
    } catch (err: any) {
      showToast('Error', err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-brand-50/30 to-cyan-50/40">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* Left: Branding Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-8 text-center lg:text-left"
        >
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-glow">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-navy-900 tracking-tight">Medi<span className="text-brand-500">Reach</span></span>
              <span className="block text-[11px] uppercase font-bold tracking-widest text-cyan-600">AI Health Access Platform</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
              Your Gateway to Verified Medicine Access
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sign in to search medicines, upload prescriptions, discover nearby pharmacies with real-time stock, and reserve medicine pickups instantly.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-2.5 text-xs text-slate-600 font-medium">
            {['AI Prescription OCR Extraction', 'Smart Access Score Rankings', 'Real-Time Stock Updates', 'Instant QR Reservation Vouchers'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Buttons */}
          <div className="pt-2 space-y-3">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">⚡ Quick Demo Access</p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleQuickLogin(acc.email)}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${acc.color} text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md hover:scale-[1.02] transition-all flex items-center justify-between gap-3 disabled:opacity-70`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{acc.icon}</span>
                    {acc.label}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">All accounts use password: <strong>demo1234</strong></p>
          </div>
        </motion.div>

        {/* Right: Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <div className="glass-card bg-white/90 rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 space-y-6">
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-navy-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Account Type</label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-navy-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Pharmacy">Pharmacy Owner</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-navy-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                    className="w-full pl-11 pr-12 py-3.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-navy-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-cyan-500 text-white font-extrabold text-sm py-4 rounded-xl shadow-glow transition-all hover:scale-[1.01] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {isLogin ? 'Signing In...' : 'Creating Account...'}</>
                ) : (
                  <>{isLogin ? <><LogIn className="w-4 h-4" /> Sign In to MediReach</> : <><UserPlus className="w-4 h-4" /> Create Account</>}</>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-400">
              By continuing, you agree to MediReach's Terms of Service. All medical information is for educational purposes only.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
