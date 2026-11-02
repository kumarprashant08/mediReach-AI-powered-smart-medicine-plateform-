import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Pill,
  Search,
  FileText,
  MapPin,
  TrendingUp,
  Info,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Find Medicine', path: '/medicines', icon: Search },
    { name: 'Prescription OCR', path: '/prescription', icon: FileText },
    { name: 'Pharmacies', path: '/pharmacies', icon: MapPin },
    { name: 'Insights', path: user?.role === 'Pharmacy' ? '/pharmacy/analytics' : '/patient/dashboard', icon: TrendingUp },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? (user.role === 'Pharmacy' ? '/pharmacy/dashboard' : user.role === 'Admin' ? '/admin/dashboard' : '/patient/dashboard') : '/login'} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Pill className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-navy-900 tracking-tight font-sans">
              Medi<span className="text-brand-500">Reach</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-600">
              AI Health Access
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-slate-200/80 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Section: Notifications & User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl p-4 border border-slate-200 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-navy-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-500" /> Notifications
                  </h4>
                  <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} unread
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          markAsRead(n._id);
                          if (n.link) navigate(n.link);
                          setIsNotificationOpen(false);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${
                          n.read ? 'bg-transparent opacity-75' : 'bg-brand-50/60 hover:bg-brand-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-semibold text-navy-900">{n.title}</h5>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-1.5 pr-3 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-navy-900 leading-none">{user.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-brand-600 font-semibold leading-tight">{user.role}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl shadow-2xl p-2 border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-navy-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to={user.role === 'Pharmacy' ? '/pharmacy/dashboard' : user.role === 'Admin' ? '/admin/dashboard' : '/patient/dashboard'}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-brand-500" /> Dashboard
                  </Link>

                  <Link
                    to="/reservations"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-500" /> My Reservations
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      navigate('/home');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/medicines"
                className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-cyan-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-glow transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-navy-900 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden glass-card border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path) ? 'bg-brand-500 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
