import React from 'react';
import { Star } from 'lucide-react';

interface FeaturedToggleProps {
  isFeatured: boolean;
  onToggle: (featured: boolean) => void;
  disabled?: boolean;
}

const FeaturedToggle: React.FC<FeaturedToggleProps> = ({ 
  isFeatured, 
  onToggle, 
  disabled = false 
}) => {
  return (
    <button
      onClick={() => onToggle(!isFeatured)}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 ${
        isFeatured
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:bg-slate-600/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
      <span className="text-sm font-medium">
        {isFeatured ? 'Mis en avant' : 'Mettre en avant'}
      </span>
    </button>
  );
};

export default FeaturedToggle; 