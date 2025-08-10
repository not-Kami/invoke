import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Save, Plus, Star } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Game {
  _id?: string;
  name: string;
  description: string;
  genre: string;
  system: string;
  image?: string | File; // Peut être une URL existante ou un nouveau fichier
  featured: boolean;
  sessionsCount?: number;
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
  const [formData, setFormData] = useState<Game>({
    name: '',
    description: '',
    genre: '',
    system: '',
    image: '',
    featured: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const isEditing = !!game?._id;
  const title = isEditing ? 'Modifier le jeu' : 'Ajouter un nouveau jeu';

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        description: game.description || '',
        genre: game.genre || '',
        system: game.system || '',
        image: game.image || '',
        featured: game.featured || false
      });
      // Si c'est un jeu existant avec une image, on l'affiche
      if (typeof game.image === 'string' && game.image) {
        setPreviewUrl(game.image);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        genre: '',
        system: '',
        image: '',
        featured: false
      });
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setErrors({});
  }, [game, isOpen]);

  // Nettoyer les URLs temporaires à la fermeture
  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

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

    if (!formData.image && !selectedFile) {
      newErrors.image = 'Une image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleInputChange = (field: keyof Game, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Créer une URL temporaire pour la prévisualisation
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Mettre à jour le formulaire avec le fichier
    setFormData(prev => ({ ...prev, image: file }));
    
    // Effacer l'erreur d'image
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
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

          {/* Image du jeu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image du jeu *
            </label>
            
            {/* Zone d'upload */}
            <div className="space-y-3">
              {/* Input file caché */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }}
                className="hidden"
                disabled={loading}
              />
              
              {/* Bouton d'upload */}
              {!previewUrl && (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Gamepad2 className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                </label>
              )}
              
              {/* Prévisualisation de l'image */}
              {previewUrl && (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600">
                    <img
                      src={previewUrl}
                      alt="Prévisualisation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Boutons d'action sur l'image */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Supprimer l'image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Informations du fichier */}
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-slate-300">
                        <span className="font-medium">Fichier sélectionné:</span> {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {errors.image && (
              <p className="mt-1 text-sm text-red-400">{errors.image}</p>
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
                  <span className="text-white ml-2">{game.sessionsCount || 0}</span>
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
