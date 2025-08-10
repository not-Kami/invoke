import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SessionsPage from './pages/sessions/SessionsPage';
import GamesPage from './pages/games/GamesPage';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SecureRoute from './components/auth/SecureRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/sessions" element={<Layout><SessionsPage /></Layout>} />
          <Route path="/games" element={<Layout><GamesPage /></Layout>} />
          <Route path="/campaigns" element={<Layout><CampaignsPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Route Dashboard - Protégée */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Route Profile - Protégée */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Routes Admin - Protégées */}
          <Route path="/admin" element={
            <SecureRoute requiredRole="admin" showSecurityInfo={true}>
              <AdminLayout>
                <AdminPage />
              </AdminLayout>
            </SecureRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;