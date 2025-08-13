import React from 'react';
import { X, Crown, Users, Gamepad2, Calendar, CheckCircle, Clock, Star } from 'lucide-react';
import Button from './Button';

interface DMConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DMConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading 
}: DMConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Become a Dungeon Master
          </h2>
          <p className="text-gray-300">
            Are you ready to create epic adventures and lead unforgettable campaigns?
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Create and manage your own sessions</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Build immersive campaigns</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Join the DM community</span>
          </div>
        </div>

        {/* Features preview */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Features you'll unlock:</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Gamepad2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-white">Sessions</span>
              <p className="text-xs text-gray-400 mt-1">Create & manage</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-white">Campaigns</span>
              <p className="text-xs text-gray-400 mt-1">Long-term stories</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-white">Planning</span>
              <p className="text-xs text-gray-400 mt-1">Schedule events</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-300 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon - DM Services
          </h3>
          <p className="text-xs text-yellow-200 mb-3">
            Soon you'll be able to offer your DM services to the community:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-yellow-200">
              <Star className="h-3 w-3" />
              <span>Set your rates</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-200">
              <Star className="h-3 w-3" />
              <span>Get booked by players</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-200">
              <Star className="h-3 w-3" />
              <span>Build your reputation</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-200">
              <Star className="h-3 w-3" />
              <span>Earn from your passion</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming...
              </div>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Become DM
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
