
import Navbar from './Navbar';
import Footer from './Footer';
import ConversationsBubble from '../ConversationsBubble';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
      {user && <ConversationsBubble />}
    </div>
  );
}