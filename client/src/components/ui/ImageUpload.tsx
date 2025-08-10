import React, { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';

interface ImageUploadProps {
  onImageChange: (imageData: string | null) => void;
  currentImage?: string | null;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageChange, 
  currentImage, 
  className = '' 
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Photo de profil (optionnel)
      </label>
      
      <div className="flex items-center space-x-4">
        {/* Aperçu de l'image */}
        <div className="relative">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Aperçu de la photo de profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Zone d'upload */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Upload className="w-6 h-6 text-gray-400 mx-auto" />
              <div className="text-sm text-gray-400">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Cliquez pour sélectionner
                </button>
                {' '}ou glissez-déposez une image
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG jusqu'à 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
