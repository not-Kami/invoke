import React, { useState } from 'react';
import { MessageSquare, MapPin, Clock, Users, Shield, Zap } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import ConversationModal from '../../components/ConversationModal';
import { useNotifications } from '../../hooks/useNotifications';

const ContactPage: React.FC = () => {
  const { addSuccess, addError } = useNotifications();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);

  const handleContactSuccess = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsConversationModalOpen(true);
    addSuccess('Your message has been sent successfully!');
  };

  const handleContactError = (error: string) => {
    addError(`Error sending message: ${error}`);
  };

  const handleCloseConversationModal = () => {
    setIsConversationModalOpen(false);
    setCurrentConversationId(null);
  };

  const contactMethods = [
    {
      icon: MapPin,
      title: 'Discord',
      description: 'Official Invoke Server',
      details: 'Real-time support'
    },
    {
      icon: Clock,
      title: 'Hours',
      description: 'Mon-Fri: 9am-6pm',
      details: 'Priority technical support'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Community Support',
      description: 'An active community of players and DMs to help you'
    },
    {
      icon: Shield,
      title: 'Guaranteed Security',
      description: 'Your personal data is protected and confidential'
    },
    {
      icon: Zap,
      title: 'Fast Response',
      description: 'Average response time of 24h for all your questions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/20 rounded-full mb-6">
              <MessageSquare className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Have a question about Invoke? A technical problem? A suggestion? 
              Our team is here to help and improve your gaming experience.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <ContactForm
              onSuccess={handleContactSuccess}
              onError={handleContactError}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                Contact Methods
              </h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {method.title}
                        </h3>
                        <p className="text-purple-300 font-medium mb-1">
                          {method.description}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {method.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                Why Contact Us?
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-cinzel font-bold text-white mb-4">
              Ready to start the adventure?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the Invoke community and discover thousands of exciting role-playing sessions 
              with players from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Discover Sessions
              </button>
              <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200">
                View Campaigns
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Modal */}
      {currentConversationId && (
        <ConversationModal
          isOpen={isConversationModalOpen}
          onClose={handleCloseConversationModal}
          conversationId={currentConversationId}
          currentUserEmail="user@example.com" // TODO: Get from auth context
        />
      )}
    </div>
  );
};

export default ContactPage;
