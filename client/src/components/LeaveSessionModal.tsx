import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './ui/Button';

interface LeaveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: (reason: string) => void;
  sessionTitle: string;
}

export default function LeaveSessionModal({ 
  isOpen, 
  onClose, 
  onLeave, 
  sessionTitle 
}: LeaveSessionModalProps) {
  const [reason, setReason] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for leaving the session');
      return;
    }

    setIsLeaving(true);
    try {
      await onLeave(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error leaving session:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleClose = () => {
    if (!isLeaving) {
      setReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Leave Session</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLeaving}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to leave <span className="font-semibold text-white">"{sessionTitle}"</span>?
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for leaving <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={isLeaving}
              required
            >
              <option value="">Select a reason...</option>
              <option value="schedule_conflict">Schedule conflict</option>
              <option value="not_interested">Not interested anymore</option>
              <option value="found_other_session">Found another session</option>
              <option value="personal_reasons">Personal reasons</option>
              <option value="game_not_suitable">Game not suitable for me</option>
              <option value="group_not_compatible">Group not compatible</option>
              <option value="technical_issues">Technical issues</option>
              <option value="other">Other</option>
            </select>
          </div>

          {reason === 'other' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Please specify
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain your reason..."
                className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                rows={3}
                disabled={isLeaving}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            disabled={isLeaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeave}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
            disabled={isLeaving || !reason.trim()}
          >
            {isLeaving ? 'Leaving...' : 'Leave Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}
