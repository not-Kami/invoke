import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Star, Check } from 'lucide-react';
import { Game } from '../../types';

interface GameForm extends Omit<Game, '_id' | 'createdAt' | 'updatedAt'> {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: Game) => Promise<void>;
  game?: Game | null; // null = nouveau jeu, Game = édition
  loading?: boolean;
}

const GameModal: React.FC<GameModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  game, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<GameForm>({
    name: '',
    description: '',
    genre: '',
    system: '',
    images: {
      logo: '',
      portrait: '',
      banner: ''
    },
    featured: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState<{
    logo: boolean;
    portrait: boolean;
    banner: boolean;
  }>({
    logo: false,
    portrait: false,
    banner: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!game?._id;
  const title = isEditing ? 'Modifier le jeu' : 'Ajouter un nouveau jeu';

  // Initialiser les données du formulaire
  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        description: game.description || '',
        genre: game.genre || '',
        system: game.system || '',
        images: {
          logo: game.images?.logo || '',
          portrait: game.images?.portrait || '',
          banner: game.images?.banner || ''
        },
        featured: game.featured || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        genre: '',
        system: '',
        images: {
          logo: '',
          portrait: '',
          banner: ''
        },
        featured: false
      });
    }
    setErrors({});
  }, [game, isOpen]);

  // Upload immédiat d'image
  const handleImageUpload = async (file: File, imageType: 'logo' | 'portrait' | 'banner') => {
    if (!game?._id) {
      return;
    }

    setUploadingImages(prev => ({ ...prev, [imageType]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/v1/upload/immediate/game/${game._id}/${imageType}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur upload ${imageType}`);
      }
      
      const result = await response.json();
      
      // Mettre à jour immédiatement le formulaire avec la nouvelle URL
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [imageType]: result.data.secure_url
        }
      }));
      
    } catch (error) {
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageType]: false }));
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (file: File, imageType: 'logo' | 'portrait' | 'banner') => {
    if (!game?._id) {
      return;
    }
    
    // Upload immédiat
    handleImageUpload(file, imageType);
  };

  // Suppression d'image
  const handleRemoveImage = async (imageType: 'logo' | 'portrait' | 'banner') => {
    if (!game?._id) {
      return;
    }

    try {
      // Extraire le public_id de l'URL Cloudinary
      const imageUrl = formData.images[imageType];
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          const response = await fetch(`/api/v1/upload/immediate/${publicId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            // Image supprimée avec succès
          }
        }
      }
      
      // Mettre à jour le formulaire
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [imageType]: ''
        }
      }));
      
    } catch (error) {
    }
  };

  // Fonction utilitaire pour extraire le public_id d'une URL Cloudinary
  const extractPublicIdFromUrl = (url: string): string | null => {
    try {
      const match = url.match(/\/upload\/v\d+\/(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.genre.trim()) {
      newErrors.genre = 'Le genre est requis';
    }
    if (!formData.system.trim()) {
      newErrors.system = 'Le système est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData as Game);
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des changements d'input
  const handleInputChange = (field: keyof Game, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-cinzel font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={loading || isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom du jeu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nom du jeu *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nom du jeu"
              disabled={loading || isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Description du jeu"
              disabled={loading || isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Genre et Système */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Genre *
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Genre"
                disabled={loading || isSubmitting}
              />
              {errors.genre && (
                <p className="mt-1 text-sm text-red-400">{errors.genre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Système *
              </label>
              <input
                type="text"
                value={formData.system}
                onChange={(e) => handleInputChange('system', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Système"
                disabled={loading || isSubmitting}
              />
              {errors.system && (
                <p className="mt-1 text-sm text-red-400">{errors.system}</p>
              )}
            </div>
          </div>

          {/* Images du jeu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Images du jeu
            </label>
            
            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Logo du jeu
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'logo');
                    }}
                    className="hidden"
                    disabled={loading || isSubmitting || uploadingImages.logo}
                  />
                  
                  {!formData.images.logo ? (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        {uploadingImages.logo ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        ) : (
                          <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        )}
                        <p className="text-xs text-slate-400">
                          {uploadingImages.logo ? 'Upload...' : 'Logo du jeu'}
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={formData.images.logo}
                          alt="Logo du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('logo')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer le logo"
                        disabled={loading || isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Portrait */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Portrait du jeu
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="portrait-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'portrait');
                    }}
                    className="hidden"
                    disabled={loading || isSubmitting || uploadingImages.portrait}
                  />
                  
                  {!formData.images.portrait ? (
                    <label
                      htmlFor="portrait-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        {uploadingImages.portrait ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        ) : (
                          <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        )}
                        <p className="text-xs text-slate-400">
                          {uploadingImages.portrait ? 'Upload...' : 'Portrait du jeu'}
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={formData.images.portrait}
                          alt="Portrait du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('portrait')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer le portrait"
                        disabled={loading || isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Bannière du jeu
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'banner');
                    }}
                    className="hidden"
                    disabled={loading || isSubmitting || uploadingImages.banner}
                  />
                  
                  {!formData.images.banner ? (
                    <label
                      htmlFor="banner-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        {uploadingImages.banner ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        ) : (
                          <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        )}
                        <p className="text-xs text-slate-400">
                          {uploadingImages.banner ? 'Upload...' : 'Bannière du jeu'}
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={formData.images.banner}
                          alt="Bannière du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('banner')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer la bannière"
                        disabled={loading || isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mis en avant */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              disabled={loading || isSubmitting}
            />
            <label htmlFor="featured" className="flex items-center space-x-2 text-slate-300">
              <Star className="w-4 h-4" />
              <span>Mettre en avant</span>
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              disabled={loading || isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameModal;
