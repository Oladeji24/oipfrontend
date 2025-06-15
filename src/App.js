import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import TraderPage from './pages/TraderPage';
import AdminPage from './pages/AdminPage';
import DemoPage from './pages/DemoPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import KucoinMarket from './components/KucoinMarket';
import DerivMarket from './components/DerivMarket';
import MarketDashboard from './components/MarketDashboard';
import LoginPage from './components/LoginPage';
import TraderDashboard from './components/TraderDashboard';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<TraderDashboard />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/kucoin" element={<ProtectedRoute><KucoinMarket /></ProtectedRoute>} />
            <Route path="/deriv" element={<ProtectedRoute><DerivMarket /></ProtectedRoute>} />
            <Route path="/markets" element={<ProtectedRoute><MarketDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
