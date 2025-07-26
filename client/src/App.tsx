import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Routes Admin - Protégées */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout>
                <AdminPage />
              </AdminLayout>
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;