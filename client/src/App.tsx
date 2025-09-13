
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SessionsPage from './pages/sessions/SessionsPage';
import CreateSessionPage from './pages/sessions/CreateSessionPage';
import SessionDetailPage from './pages/sessions/SessionDetailPage';
import EditSessionPage from './pages/sessions/EditSessionPage';
import GamesPage from './pages/games/GamesPage';
import GameDetailPage from './pages/games/GameDetailPage';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import CreateCampaignPage from './pages/campaigns/CreateCampaignPage';
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import ContactPage from './pages/contact/ContactPage';
import AboutPage from './pages/AboutPage';
import ConversationsPage from './pages/conversations/ConversationsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SecureRoute from './components/auth/SecureRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminPage from './pages/admin/AdminPage';
import ConversationPage from './pages/admin/conversations/ConversationPage';
import AdminUserDetailPage from './pages/admin/users/UserDetailPage';
import AdminSessionDetailPage from './pages/admin/sessions/SessionDetailPage';
import AdminGameDetailPage from './pages/admin/games/GameDetailPage';
import AdminCampaignDetailPage from './pages/admin/campaigns/CampaignDetailPage';
import OnboardingDemo from './components/onboarding/OnboardingDemo';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/sessions" element={<Layout><SessionsPage /></Layout>} />
          <Route path="/sessions/:id" element={<Layout><SessionDetailPage /></Layout>} />
          <Route path="/sessions/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateSessionPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/sessions/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <EditSessionPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/games" element={<Layout><GamesPage /></Layout>} />
          <Route path="/game/:gameId" element={<Layout><GameDetailPage /></Layout>} />
          <Route path="/campaigns" element={<Layout><CampaignsPage /></Layout>} />
          <Route path="/campaigns/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateCampaignPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/campaigns/:id" element={<Layout><CampaignDetailPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
          
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
          
          {/* Route Profile Edit - Redirige vers profile avec état d'édition */}
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage defaultEditMode={true} />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Route Conversations - Protégée */}
          <Route path="/conversations" element={
            <ProtectedRoute>
              <Layout>
                <ConversationsPage />
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

          {/* Route Demo Onboarding - Pour les tests */}
          <Route path="/demo/onboarding" element={
            <Layout>
              <OnboardingDemo />
            </Layout>
          } />

          {/* Routes Admin Detail - Protégées */}
          <Route path="/admin/users/:id" element={
            <SecureRoute requiredRole="admin" showSecurityInfo={true}>
              <AdminLayout>
                <AdminUserDetailPage />
              </AdminLayout>
            </SecureRoute>
          } />
          
          <Route path="/admin/sessions/:id" element={
            <SecureRoute requiredRole="admin" showSecurityInfo={true}>
              <AdminLayout>
                <AdminSessionDetailPage />
              </AdminLayout>
            </SecureRoute>
          } />
          
          <Route path="/admin/games/:id" element={
            <SecureRoute requiredRole="admin" showSecurityInfo={true}>
              <AdminLayout>
                <AdminGameDetailPage />
              </AdminLayout>
            </SecureRoute>
          } />
          
          <Route path="/admin/campaigns/:id" element={
            <SecureRoute requiredRole="admin" showSecurityInfo={true}>
              <AdminLayout>
                <AdminCampaignDetailPage />
              </AdminLayout>
            </SecureRoute>
          } />

          {/* Route Conversation - Protégée */}
          <Route path="/admin/conversations/:id" element={
            <ProtectedRoute>
              <Layout>
                <ConversationPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;