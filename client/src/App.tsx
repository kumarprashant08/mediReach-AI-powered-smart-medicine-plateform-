import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { MediReachAIChat } from './components/ai/MediReachAIChat';

import { PatientDashboard } from './pages/PatientDashboard';
import { MedicineSearchPage } from './pages/MedicineSearchPage';
import { MedicineDetailPage } from './pages/MedicineDetailPage';
import { PrescriptionOCRPage } from './pages/PrescriptionOCRPage';
import { PharmacyDiscoveryPage } from './pages/PharmacyDiscoveryPage';
import { ReservationListPage } from './pages/ReservationListPage';
import { ReservationDetailPage } from './pages/ReservationDetailPage';
import { PharmacyDashboardPage } from './pages/PharmacyDashboardPage';
import { PharmacyAnalyticsPage } from './pages/PharmacyAnalyticsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { LandingPage } from './pages/LandingPage';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <span className="text-sm font-semibold text-slate-600">Checking authentication...</span>
    </div>
  </div>
);

const getDashboardPath = (role?: string) => {
  if (role === 'Pharmacy') return '/pharmacy/dashboard';
  if (role === 'Admin') return '/admin/dashboard';
  return '/home';
};

/**
 * Every application page is protected except /login.
 * A user cannot access the main site by typing a URL directly.
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

/**
 * Login is the only public application route.
 * Already-authenticated users are sent directly to their role dashboard.
 */
const LoginOnlyRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;

  return <LoginPage />;
};

const AppShell: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-navy-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* PUBLIC: authentication only */}
          <Route path="/login" element={<LoginOnlyRoute />} />

          {/* PROTECTED: patient/pharmacy/admin application */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
          <Route path="/medicines" element={<ProtectedRoute><MedicineSearchPage /></ProtectedRoute>} />
          <Route path="/medicine/:id" element={<ProtectedRoute><MedicineDetailPage /></ProtectedRoute>} />
          <Route path="/prescription" element={<ProtectedRoute><PrescriptionOCRPage /></ProtectedRoute>} />
          <Route path="/pharmacies" element={<ProtectedRoute><PharmacyDiscoveryPage /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><ReservationListPage /></ProtectedRoute>} />
          <Route path="/reservation/:id" element={<ProtectedRoute><ReservationDetailPage /></ProtectedRoute>} />

          <Route path="/patient/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'Patient' ? <PatientDashboard /> : <Navigate to={getDashboardPath(user?.role)} replace />}
            </ProtectedRoute>
          } />

          <Route path="/pharmacy/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'Pharmacy' ? <PharmacyDashboardPage /> : <Navigate to={getDashboardPath(user?.role)} replace />}
            </ProtectedRoute>
          } />

          <Route path="/pharmacy/analytics" element={
            <ProtectedRoute>
              {user?.role === 'Pharmacy' ? <PharmacyAnalyticsPage /> : <Navigate to={getDashboardPath(user?.role)} replace />}
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'Admin' ? <AdminDashboardPage /> : <Navigate to={getDashboardPath(user?.role)} replace />}
            </ProtectedRoute>
          } />

          {/* Unknown URLs are never allowed to expose the app */}
          <Route path="*" element={<Navigate to={user ? getDashboardPath(user.role) : '/login'} replace />} />
        </Routes>
      </main>
      {user && <Footer />}
      {user && <MediReachAIChat />}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <SocketProvider>
      <NotificationProvider>
        <Router>
          <AppShell />
        </Router>
      </NotificationProvider>
    </SocketProvider>
  </AuthProvider>
);

export default App;
