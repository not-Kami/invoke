import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Save, Plus, Star } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { normalizeGameName } from '../../utils/gameUtils';
import { Game } from '../../types';

// Type pour le formulaire (sans les propriétés requises par la base de données)
type GameForm = Omit<Game, '_id' | 'createdAt' | 'updatedAt'> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  const [selectedFiles, setSelectedFiles] = useState<{
    logo?: File;
    portrait?: File;
    banner?: File;
  }>({});
  const [previewUrls, setPreviewUrls] = useState<{
    logo?: string;
    portrait?: string;
    banner?: string;
  }>({});

  const isEditing = !!game?._id;
  const title = isEditing ? 'Modifier le jeu' : 'Ajouter un nouveau jeu';

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
      // Si c'est un jeu existant avec des images, on les affiche
      if (game.images) {
        const urls: any = {};
        if (typeof game.images.logo === 'string' && game.images.logo) {
          urls.logo = game.images.logo;
        }
        if (typeof game.images.portrait === 'string' && game.images.portrait) {
          urls.portrait = game.images.portrait;
        }
        if (typeof game.images.banner === 'string' && game.images.banner) {
          urls.banner = game.images.banner;
        }
        setPreviewUrls(urls);
      }
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
    setSelectedFiles({});
    setPreviewUrls({});
    setErrors({});
  }, [game, isOpen]);

  // Nettoyer les URLs temporaires à la fermeture
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du jeu est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description du jeu est requise';
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Le genre du jeu est requis';
    }

    if (!formData.system.trim()) {
      newErrors.system = 'Le système de jeu est requis';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Protection contre les soumissions multiples
    if (isSubmitting) {
      console.log('🚫 Soumission déjà en cours...');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Préparer les données pour l'envoi (sans les fichiers)
      const gameDataToSend = { ...formData };
      
      // Nettoyer les objets File des données envoyées
      if (gameDataToSend.images) {
        Object.keys(gameDataToSend.images).forEach(key => {
          const imageKey = key as keyof typeof gameDataToSend.images;
          const imageValue = gameDataToSend.images[imageKey];
          if (imageValue && typeof imageValue === 'object' && (imageValue as any).constructor?.name === 'File') {
            delete gameDataToSend.images[imageKey];
          }
        });
      }
      
      try {
        // Détecter si c'est une création ou une modification
        const isEditing = !!game?._id;
        
        // Nettoyer complètement le champ images avant l'envoi
        const cleanGameData = { ...gameDataToSend };
        if (cleanGameData.images) {
          // Supprimer toutes les images (même les chaînes vides)
          cleanGameData.images = {} as any;
        }
        
        // Si c'est une modification, s'assurer que l'ID est présent
        if (isEditing && game?._id) {
          cleanGameData._id = game._id;
        }
        
        const savedGame = await onSave(cleanGameData as Game);
        
        console.log('🔍 Debug onSave:', {
          savedGame,
          savedGameId: (savedGame as any)?._id,
          gameDataToSend,
          gameDataToSendId: gameDataToSend._id,
          hasSelectedFiles: Object.keys(selectedFiles).length > 0
        });
        
        // Si on a des fichiers sélectionnés, les uploader après création
        if (Object.keys(selectedFiles).length > 0) {
          // DÉTECTER si c'est un jeu existant ou nouveau
          let gameIdentifier;
          
          if (gameDataToSend._id) {
            // JEU EXISTANT: Utiliser l'ID pour éviter la duplication
            gameIdentifier = gameDataToSend._id;
            console.log('🆔 Upload pour jeu EXISTANT avec ID:', gameIdentifier);
          } else {
            // NOUVEAU JEU: Utiliser le nom formaté
            gameIdentifier = normalizeGameName(gameDataToSend.name || '');
            console.log('📝 Upload pour NOUVEAU jeu avec nom:', gameIdentifier);
          }
          
          console.log('🎯 Identifiant final pour upload:', gameIdentifier);
          
          for (const [imageType, file] of Object.entries(selectedFiles)) {
            if (file) {
              try {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('imageType', imageType);
                
                              // Utiliser la route appropriée selon le type d'identifiant
              const uploadUrl = gameDataToSend._id 
                ? `/api/v1/upload/game/id/${gameIdentifier}/${imageType}`  // Route avec ID
                : `/api/v1/upload/game/${gameIdentifier}/${imageType}`;    // Route avec nom
              
              console.log('📤 Upload URL:', uploadUrl);
                
                const response = await fetch(uploadUrl, {
                  method: 'POST',
                  body: formData,
                });
                
                if (!response.ok) {
                  console.error(`❌ Erreur upload ${imageType}:`, await response.text());
                } else {
                  console.log(`✅ Upload ${imageType} réussi`);
                }
              } catch (error) {
                console.error(`❌ Erreur upload ${imageType}:`, error);
              }
            }
          }
        }
        
        onClose();
      } catch (error) {
        console.error('❌ Erreur lors de la création du jeu:', error);
        throw error; // Re-lancer l'erreur pour que handleSaveGame puisse la gérer
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Game, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (file: File, imageType: 'logo' | 'portrait' | 'banner') => {
    setSelectedFiles(prev => ({ ...prev, [imageType]: file }));
    
    // Créer une URL temporaire pour la prévisualisation
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [imageType]: url }));
    
    // Mettre à jour le formulaire avec le fichier
    setFormData(prev => ({ 
      ...prev, 
      images: { ...prev.images, [imageType]: file }
    }));
    
    // Effacer l'erreur d'images
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleRemoveImage = (imageType: 'logo' | 'portrait' | 'banner') => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[imageType];
      return newFiles;
    });
    
    setPreviewUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[imageType];
      return newUrls;
    });
    
    setFormData(prev => ({ 
      ...prev, 
      images: { ...prev.images, [imageType]: '' }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-cinzel font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom du jeu */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nom du jeu *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-slate-600 focus:border-purple-500'
              }`}
              placeholder="Ex: Donjons & Dragons"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description du jeu */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-slate-600 focus:border-purple-500'
              }`}
              placeholder="Description du jeu, de son univers et de ses mécaniques..."
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Genre du jeu */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-slate-300 mb-2">
              Genre *
            </label>
            <input
              type="text"
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.genre ? 'border-red-500' : 'border-slate-600 focus:border-purple-500'
              }`}
              placeholder="Ex: Fantasy, Science-Fiction, Horreur..."
              disabled={loading}
            />
            {errors.genre && (
              <p className="mt-1 text-sm text-red-400">{errors.genre}</p>
            )}
          </div>

          {/* Système de jeu */}
          <div>
            <label htmlFor="system" className="block text-sm font-medium text-slate-300 mb-2">
              Système de jeu *
            </label>
            <input
              type="text"
              id="system"
              value={formData.system}
              onChange={(e) => handleInputChange('system', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.system ? 'border-red-500' : 'border-slate-600 focus:border-purple-500'
              }`}
              placeholder="Ex: D&D 5e, Pathfinder 2e"
              disabled={loading}
            />
            {errors.system && (
              <p className="mt-1 text-sm text-red-400">{errors.system}</p>
            )}
          </div>

          {/* Images du jeu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Images du jeu (optionnelles)
            </label>
            
            <div className="space-y-4">
              {/* Logo du jeu */}
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
                      if (file) {
                        handleFileSelect(file, 'logo');
                      }
                    }}
                    className="hidden"
                    disabled={loading}
                  />
                  
                  {!previewUrls.logo && (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        <p className="text-xs text-slate-400">Logo du jeu</p>
                      </div>
                    </label>
                  )}
                  
                  {previewUrls.logo && (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={previewUrls.logo}
                          alt="Logo du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('logo')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer le logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Portrait du jeu */}
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
                      if (file) {
                        handleFileSelect(file, 'portrait');
                      }
                    }}
                    className="hidden"
                    disabled={loading}
                  />
                  
                  {!previewUrls.portrait && (
                    <label
                      htmlFor="portrait-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        <p className="text-xs text-slate-400">Portrait du jeu</p>
                      </div>
                    </label>
                  )}
                  
                  {previewUrls.portrait && (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={previewUrls.portrait}
                          alt="Portrait du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('portrait')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer le portrait"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bannière du jeu */}
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
                      if (file) {
                        handleFileSelect(file, 'banner');
                      }
                    }}
                    className="hidden"
                    disabled={loading}
                  />
                  
                  {!previewUrls.banner && (
                    <label
                      htmlFor="banner-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Gamepad2 className="w-6 h-6 mb-1 text-slate-400" />
                        <p className="text-xs text-slate-400">Bannière du jeu</p>
                      </div>
                    </label>
                  )}
                  
                  {previewUrls.banner && (
                    <div className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-600">
                        <img
                          src={previewUrls.banner}
                          alt="Bannière du jeu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('banner')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Supprimer la bannière"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {errors.images && (
              <p className="mt-1 text-sm text-red-400">{errors.images}</p>
            )}
          </div>

          {/* Mis en avant */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              disabled={loading}
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-300">
              Mettre en avant
            </label>
            {formData.featured && (
              <Badge variant="success" className="ml-2">
                <Star className="w-3 h-3 mr-1" />
                Mis en avant
              </Badge>
            )}
          </div>

          {/* Informations supplémentaires (en lecture seule si édition) */}
          {isEditing && game && (
            <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Informations</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Sessions:</span>
                  <span className="text-white ml-2">0</span>
                </div>
                
                <div>
                  <span className="text-slate-400">Créé le:</span>
                  <span className="text-white ml-2">
                    {game.createdAt ? new Date(game.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sauvegarde...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isEditing ? 'Modifier' : 'Ajouter'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameModal;
