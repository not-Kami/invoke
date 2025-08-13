import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
  onRemove: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove, className = '' }) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  if (!file || !preview) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <img
          src={preview}
          alt="Aperçu de l'image"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary-200 shadow-md"
        />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md"
          title="Supprimer l'image"
        >
          <X className="w-3 h-3" />
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {file.name}
      </p>
    </div>
  );
};

export default ImagePreview;
