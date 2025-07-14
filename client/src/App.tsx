import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import SessionsPage from '@/pages/sessions/SessionsPage';
import GamesPage from '@/pages/games/GamesPage';
import CampaignsPage from '@/pages/campaigns/CampaignsPage';
import PlayersPage from '@/pages/players/PlayersPage';
import ProfilePage from '@/pages/profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/sessions" element={<Layout><SessionsPage /></Layout>} />
          <Route path="/games" element={<Layout><GamesPage /></Layout>} />
          <Route path="/campaigns" element={<Layout><CampaignsPage /></Layout>} />
          <Route path="/players" element={<Layout><PlayersPage /></Layout>} />
          
          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <Layout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;