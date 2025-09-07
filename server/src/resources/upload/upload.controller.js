import fs from 'fs';
import path from 'path';
import Game from '../game/game.model.js';
import { getFilePath, deleteFile } from '../../middlewares/upload.middleware.js';
import { deleteFromCloudinary } from '../../config/cloudinary.config.js';

// Upload d'avatar utilisateur
export const uploadUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const userId = req.params.id || req.body.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur requis'
            });
        }

        // Supprimer l'ancien avatar s'il existe
        const oldAvatarPath = getFilePath('user', userId);
        const oldAvatarDir = path.dirname(oldAvatarPath);
        
        if (fs.existsSync(oldAvatarDir)) {
            const files = fs.readdirSync(oldAvatarDir);
            files.forEach(file => {
                if (file.startsWith('avatar')) {
                    fs.unlinkSync(path.join(oldAvatarDir, file));
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Avatar uploadé avec succès',
            data: {
                userId,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/user/${userId}/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error('Erreur upload avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'avatar'
        });
    }
};

// Upload de bannière de session
export const uploadSessionBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const sessionId = req.params.id || req.body.sessionId;
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'ID session requis'
            });
        }

        // Supprimer l'ancienne bannière si elle existe
        const oldBannerPath = getFilePath('session', sessionId);
        const oldBannerDir = path.dirname(oldBannerPath);
        
        if (fs.existsSync(oldBannerDir)) {
            const files = fs.readdirSync(oldBannerDir);
            files.forEach(file => {
                if (file.startsWith('banner')) {
                    fs.unlinkSync(path.join(oldBannerDir, file));
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bannière de session uploadée avec succès',
            data: {
                sessionId,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/session/${sessionId}/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error('Erreur upload bannière session:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de la bannière de session'
        });
    }
};

// Upload de bannière de campagne
export const uploadCampaignBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const campaignId = req.params.id || req.body.campaignId;
        if (!campaignId) {
            return res.status(400).json({
                success: false,
                message: 'ID campagne requis'
            });
        }

        // Supprimer l'ancienne bannière si elle existe
        const oldBannerPath = getFilePath('campaign', campaignId);
        const oldBannerDir = path.dirname(oldBannerPath);
        
        if (fs.existsSync(oldBannerDir)) {
            const files = fs.readdirSync(oldBannerDir);
            files.forEach(file => {
                if (file.startsWith('banner')) {
                    fs.unlinkSync(path.join(oldBannerDir, file));
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bannière de campagne uploadée avec succès',
            data: {
                campaignId,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/campaign/${campaignId}/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error('Erreur upload bannière campagne:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de la bannière de campagne'
        });
    }
};

// Upload d'image de jeu (simplifié)
export const uploadGameImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Extraire les paramètres depuis l'URL
        const gameId = req.params.gameId;
        const imageType = req.params.imageType || 'logo';
        
        console.log('🔍 Upload image de jeu:', {
            gameId,
            imageType,
            file: req.file.filename
        });
        
        if (!gameId) {
            return res.status(400).json({
                success: false,
                message: 'ID du jeu requis'
            });
        }

        if (!imageType || !['logo', 'banner', 'portrait'].includes(imageType)) {
            return res.status(400).json({
                success: false,
                message: 'Type d\'image requis: logo, banner ou portrait'
            });
        }

        // Vérifier que l'ID est valide
        if (!/^[0-9a-fA-F]{24}$/.test(gameId)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'ID de jeu invalide'
            });
        }

        // Construire l'URL de l'image (absolue)
        const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
        const imageUrl = `${baseUrl}/uploads/game/${gameId}/${req.file.filename}`;
        
        console.log('🔗 URL de l\'image calculée:', imageUrl);
        console.log('🌐 Base URL:', baseUrl);
        
        // Mettre à jour le jeu avec juste le nom du fichier (pas l'URL complète)
        try {
            const updateResult = await Game.findByIdAndUpdate(
                gameId,
                { 
                    $set: { 
                        [`images.${imageType}`]: req.file.filename  // Juste le nom du fichier
                    } 
                },
                { new: true }
            );
            
            if (updateResult) {
                console.log('✅ Jeu mis à jour avec le nom du fichier:', req.file.filename);
                console.log('📝 Jeu mis à jour:', updateResult.name);
                console.log('🆔 ID du jeu mis à jour:', updateResult._id);
            } else {
                console.log('⚠️ Jeu non trouvé pour la mise à jour');
                return res.status(404).json({
                    success: false,
                    message: 'Jeu non trouvé'
                });
            }
        } catch (updateError) {
            console.error('❌ Erreur lors de la mise à jour du jeu:', updateError);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du jeu'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Image de jeu uploadée avec succès',
            data: {
                gameId,
                imageType,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                calculatedUrl: imageUrl  // URL calculée pour référence
            }
        });
    } catch (error) {
        console.error('❌ Erreur upload image de jeu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image de jeu',
            error: error.message
        });
    }
};

// Supprimer une image
export const deleteImage = async (req, res) => {
    try {
        const { type, id, imageType } = req.params;
        
        if (!type || !id) {
            return res.status(400).json({
                success: false,
                message: 'Type et ID requis'
            });
        }

        let filePath;
        try {
            filePath = getFilePath(type, id, imageType);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Chercher le fichier avec n'importe quelle extension
        const dir = path.dirname(filePath);
        const baseName = path.basename(filePath);
        
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            const targetFile = files.find(file => file.startsWith(baseName));
            
            if (targetFile) {
                const fullPath = path.join(dir, targetFile);
                if (deleteFile(fullPath)) {
                    return res.status(200).json({
                        success: true,
                        message: 'Image supprimée avec succès'
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur lors de la suppression du fichier'
                    });
                }
            }
        }

        res.status(404).json({
            success: false,
            message: 'Image non trouvée'
        });
    } catch (error) {
        console.error('Erreur suppression image:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image'
        });
    }
};

// Obtenir les informations d'une image
export const getImageInfo = async (req, res) => {
    try {
        const { type, id, imageType } = req.params;
        
        if (!type || !id) {
            return res.status(400).json({
                success: false,
                message: 'Type et ID requis'
            });
        }

        let filePath;
        try {
            filePath = getFilePath(type, id, imageType);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        const dir = path.dirname(filePath);
        const baseName = path.basename(filePath);
        
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            const targetFile = files.find(file => file.startsWith(baseName));
            
            if (targetFile) {
                const fullPath = path.join(dir, targetFile);
                const stats = fs.statSync(fullPath);
                
                return res.status(200).json({
                    success: true,
                    data: {
                        filename: targetFile,
                        path: fullPath,
                        size: stats.size,
                        created: stats.birthtime,
                        modified: stats.mtime,
                        url: `/uploads/${type}/${id}/${targetFile}`
                    }
                });
            }
        }

        res.status(404).json({
            success: false,
            message: 'Image non trouvée'
        });
    } catch (error) {
        console.error('Erreur récupération info image:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des informations de l\'image'
        });
    }
};

// Lister toutes les images d'un type donné
export const listImages = async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!type || !['user', 'session', 'campaign', 'game'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Type invalide. Types acceptés: user, session, campaign, game'
            });
        }

        const basePath = `uploads/${type}`;
        if (!fs.existsSync(basePath)) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const items = fs.readdirSync(basePath);
        const images = [];

        for (const item of items) {
            const itemPath = path.join(basePath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                const files = fs.readdirSync(itemPath);
                const imageFiles = files.filter(file => 
                    file.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                );
                
                if (imageFiles.length > 0) {
                    images.push({
                        id: item,
                        type,
                        images: imageFiles.map(file => ({
                            filename: file,
                            url: `/uploads/${type}/${item}/${file}`,
                            size: fs.statSync(path.join(itemPath, file)).size
                        }))
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error('Erreur liste images:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la liste des images'
        });
    }
};

// ===== CONTRÔLEURS CLOUDINARY =====

// Upload d'avatar utilisateur avec Cloudinary
export const uploadUserAvatarCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const userId = req.params.id || req.body.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur requis'
            });
        }

        if (!req.cloudinaryResult) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'upload vers Cloudinary'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Avatar uploadé avec succès',
            data: {
                userId,
                public_id: req.cloudinaryResult.public_id,
                secure_url: req.cloudinaryResult.secure_url,
                width: req.cloudinaryResult.width,
                height: req.cloudinaryResult.height,
                bytes: req.cloudinaryResult.bytes,
                format: req.cloudinaryResult.format,
                url: req.cloudinaryResult.secure_url
            }
        });
    } catch (error) {
        console.error('Erreur upload avatar Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'avatar'
        });
    }
};

// Upload de bannière de session avec Cloudinary
export const uploadSessionBannerCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const sessionId = req.params.id || req.body.sessionId;
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'ID session requis'
            });
        }

        if (!req.cloudinaryResult) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'upload vers Cloudinary'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bannière de session uploadée avec succès',
            data: {
                sessionId,
                public_id: req.cloudinaryResult.public_id,
                secure_url: req.cloudinaryResult.secure_url,
                width: req.cloudinaryResult.width,
                height: req.cloudinaryResult.height,
                bytes: req.cloudinaryResult.bytes,
                format: req.cloudinaryResult.format,
                url: req.cloudinaryResult.secure_url
            }
        });
    } catch (error) {
        console.error('Erreur upload bannière session Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de la bannière de session'
        });
    }
};

// Upload de bannière de campagne avec Cloudinary
export const uploadCampaignBannerCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const campaignId = req.params.id || req.body.campaignId;
        if (!campaignId) {
            return res.status(400).json({
                success: false,
                message: 'ID campagne requis'
            });
        }

        if (!req.cloudinaryResult) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'upload vers Cloudinary'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bannière de campagne uploadée avec succès',
            data: {
                campaignId,
                public_id: req.cloudinaryResult.public_id,
                secure_url: req.cloudinaryResult.secure_url,
                width: req.cloudinaryResult.width,
                height: req.cloudinaryResult.height,
                bytes: req.cloudinaryResult.bytes,
                format: req.cloudinaryResult.format,
                url: req.cloudinaryResult.secure_url
            }
        });
    } catch (error) {
        console.error('Erreur upload bannière campagne Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de la bannière de campagne'
        });
    }
};

// Upload d'image de jeu avec Cloudinary
export const uploadGameImageCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const gameId = req.params.gameId;
        const imageType = req.params.imageType || 'logo';
        
        if (!gameId) {
            return res.status(400).json({
                success: false,
                message: 'ID du jeu requis'
            });
        }

        if (!imageType || !['logo', 'banner', 'portrait'].includes(imageType)) {
            return res.status(400).json({
                success: false,
                message: 'Type d\'image requis: logo, banner ou portrait'
            });
        }

        if (!req.cloudinaryResult) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'upload vers Cloudinary'
            });
        }

        // Mettre à jour le jeu avec l'URL Cloudinary
        try {
            const updateResult = await Game.findByIdAndUpdate(
                gameId,
                { 
                    $set: { 
                        [`images.${imageType}`]: req.cloudinaryResult.secure_url
                    } 
                },
                { new: true }
            );
            
            if (!updateResult) {
                return res.status(404).json({
                    success: false,
                    message: 'Jeu non trouvé'
                });
            }
        } catch (updateError) {
            console.error('Erreur lors de la mise à jour du jeu:', updateError);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du jeu'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Image de jeu uploadée avec succès',
            data: {
                gameId,
                imageType,
                public_id: req.cloudinaryResult.public_id,
                secure_url: req.cloudinaryResult.secure_url,
                width: req.cloudinaryResult.width,
                height: req.cloudinaryResult.height,
                bytes: req.cloudinaryResult.bytes,
                format: req.cloudinaryResult.format,
                url: req.cloudinaryResult.secure_url
            }
        });
    } catch (error) {
        console.error('Erreur upload image de jeu Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image de jeu'
        });
    }
};

// Supprimer une image de Cloudinary
export const deleteImageCloudinary = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID requis'
            });
        }

        const result = await deleteFromCloudinary(publicId);
        
        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'Image supprimée avec succès'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image non trouvée'
            });
        }
    } catch (error) {
        console.error('Erreur suppression image Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image'
        });
    }
};
