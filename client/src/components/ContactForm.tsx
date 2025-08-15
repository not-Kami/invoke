import React, { useState } from 'react';
import { MessageSquare, Send, User, Mail, FileText, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { conversationsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  type: 'general' | 'technical' | 'billing' | 'partnership' | 'other';
}

interface ContactFormProps {
  onSuccess?: (conversationId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  onSuccess, 
  onError, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    message: '',
    type: 'general'
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [createdConversationId, setCreatedConversationId] = useState<string | null>(null);

  const contactTypes = [
    { value: 'general', label: 'General Question', description: 'General information about Invoke' },
    { value: 'technical', label: 'Technical Support', description: 'Technical problem or bug' },
    { value: 'billing', label: 'Billing', description: 'Payment question' },
    { value: 'partnership', label: 'Partnership', description: 'Collaboration proposal' },
    { value: 'other', label: 'Other', description: 'Other request' }
  ];

  // Generate subject based on request type
  const getSubjectFromType = (type: string): string => {
    const typeMap: Record<string, string> = {
      general: 'General Question about Invoke',
      technical: 'Technical Support Request',
      billing: 'Billing Question',
      partnership: 'Partnership Proposal',
      other: 'Other Request'
    };
    return typeMap[type] || 'Contact Request';
  };

  // Enhanced email validation
  const validateEmail = (email: string): boolean => {
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'guerrillamail.com', 'tempmail.org', 'mailinator.com',
      'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getairmail.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) return false;
    
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    // Name validation - only required for non-connected users
    if (!user && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!user && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation - only required for non-connected users
    if (!user && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!user && !validateEmail(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Message validation - always required
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Generate subject automatically from request type
      const subject = getSubjectFromType(formData.type);
      
      // Prepare data based on user connection status
      const apiData: {
        userEmail: string;
        content: string;
        conversationType: string;
        subject: string;
        userName?: string;
      } = {
        userEmail: user ? user.email : formData.email,
        content: formData.message,
        conversationType: 'contact_admin', // Toujours 'contact_admin' pour les formulaires de contact
        subject: subject
      };

      // Add user info if not connected
      if (!user) {
        apiData.userName = formData.name;
      } else {
        // Add user info for connected users
        apiData.userName = `${user.firstName} ${user.lastName}`;
      }
      
      // Call API to create conversation with correct field names
      const response = await conversationsApi.createContactAdmin(apiData);

      if (response.success && response.data) {
        setCreatedConversationId(response.data._id);
        setSubmitStatus('success');
        setFormData({
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : '',
          message: '',
          type: 'general'
        });
        
        if (onSuccess) {
          onSuccess(response.data._id);
        }

        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error(response.error || 'Error sending message');
      }

    } catch (error) {
      console.error('Error sending form:', error);
      setSubmitStatus('error');
      
      if (onError) {
        onError(error instanceof Error ? error.message : 'Error sending message');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for modified field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const openConversation = () => {
    if (createdConversationId) {
      // TODO: Open conversation popup/modal
      // For now, we'll just show a message
      console.log('Opening conversation:', createdConversationId);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className={`bg-green-900/20 border border-green-500/30 rounded-lg p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-300 mb-2">Message sent successfully!</h3>
        <p className="text-green-200 mb-4">
          We have received your message and will respond as soon as possible.
        </p>
        <div className="space-y-3">
          <Button
            onClick={openConversation}
            variant="primary"
            className="bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Conversation
          </Button>
          <Button
            onClick={() => setSubmitStatus('idle')}
            variant="outline"
            className="border-green-500/50 text-green-300 hover:bg-green-500/20"
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-cinzel font-bold text-white mb-2">
          Contact Us
        </h2>
        <p className="text-slate-400">
          {user 
            ? `Hello ${user.firstName}! How can we help you today?`
            : 'Have a question? A problem? Don\'t hesitate to contact us!'
          }
        </p>
        {user && (
          <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">
              <strong>Connected as:</strong> {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Request Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contactTypes.map((type) => (
              <label
                key={type.value}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                  formData.type === type.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="sr-only"
                />
                <div className="text-sm font-medium text-white mb-1">
                  {type.label}
                </div>
                <div className="text-xs text-slate-400">
                  {type.description}
                </div>
                {formData.type === type.value && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Name and Email - Only show for non-connected users */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                We'll use this to respond to your request
              </p>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={5}
            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.message ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="Describe your request in detail..."
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.message}
            </p>
          )}
          <div className="text-xs text-slate-500 mt-1 text-right">
            {formData.message.length}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </div>

        {/* Global Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 inline mr-2" />
            <span className="text-red-300">
              An error occurred while sending. Please try again.
            </span>
          </div>
        )}
      </form>

      {/* Additional Information */}
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="text-center text-sm text-slate-400">
          <p className="mb-2">
            <strong>Average response time:</strong> 24-48h
          </p>
          <p>
            For technical emergencies, contact us directly on Discord
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
