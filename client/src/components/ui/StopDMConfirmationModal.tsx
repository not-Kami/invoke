import React from 'react';
import { X, Crown, AlertTriangle, Users, Gamepad2, Calendar } from 'lucide-react';
import Button from './Button';

interface StopDMConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function StopDMConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading 
}: StopDMConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Stop being a DM?
          </h2>
          <p className="text-gray-300">
            This action will have important consequences
          </p>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">
              <p className="font-medium mb-1">Warning:</p>
              <ul className="space-y-1 text-xs">
                <li>• You won't be able to create new sessions</li>
                <li>• Your active sessions will remain visible</li>
                <li>• You'll lose access to DM tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current features */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Features you'll lose:</h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <Gamepad2 className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <span className="text-gray-400">Create Sessions</span>
            </div>
            <div className="text-center">
              <Users className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <span className="text-gray-400">Manage Players</span>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <span className="text-gray-400">DM Tools</span>
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
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0"
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
                <X className="h-4 w-4 mr-2" />
                Stop being DM
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
