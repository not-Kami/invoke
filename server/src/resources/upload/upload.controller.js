import Game from '../game/game.model.js';
import User from '../user/user.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.config.js';
import logger from '../../config/logger.config.js';

// Upload immédiat d'image de jeu avec sauvegarde directe en base
export const uploadGameImageImmediate = async (req, res) => {
    try {
        const { gameId, imageType } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Vérifier que le jeu existe
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Jeu non trouvé'
            });
        }

        // Supprimer l'ancienne image si elle existe
        const oldImageUrl = game.images?.[imageType];
        if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
            try {
                // Extraire le public_id de l'URL Cloudinary
                const publicId = extractPublicIdFromUrl(oldImageUrl);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                    logger.info(`Ancienne image ${imageType} supprimée: ${publicId}`);
                }
            } catch (error) {
                logger.warn(`Impossible de supprimer l'ancienne image: ${error.message}`);
            }
        }

        // Upload vers Cloudinary
        const publicId = `game/${gameId}/${imageType}`;
        const uploadResult = await uploadToCloudinary(req.file, {
            folder: 'invoke',
            public_id: publicId,
            transformation: {
                quality: 'auto',
                fetch_format: 'auto'
            }
        });

        // Sauvegarder immédiatement l'URL en base
        const updateData = {
            [`images.${imageType}`]: uploadResult.secure_url
        };

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { $set: updateData },
            { new: true }
        );

        logger.info(`Image ${imageType} uploadée et sauvée pour le jeu ${gameId}`);

        res.status(200).json({
            success: true,
            message: `Image ${imageType} uploadée avec succès`,
            data: {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                game: updatedGame
            }
        });

    } catch (error) {
        logger.error('Erreur upload immédiat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image',
            error: error.message
        });
    }
};

// Upload immédiat d'avatar utilisateur
export const uploadUserAvatarImmediate = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Vérifier que l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Supprimer l'ancien avatar si il existe
        if (user.avatar && user.avatar.includes('cloudinary.com')) {
            try {
                const publicId = extractPublicIdFromUrl(user.avatar);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.warn(`Impossible de supprimer l'ancien avatar: ${error.message}`);
            }
        }

        // Upload vers Cloudinary
        const publicId = `user/${userId}/avatar`;
        const uploadResult = await uploadToCloudinary(req.file, {
            folder: 'invoke',
            public_id: publicId,
            transformation: {
                quality: 'auto',
                fetch_format: 'auto'
            }
        });

        // Sauvegarder immédiatement l'URL en base
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: uploadResult.secure_url },
            { new: true }
        );

        logger.info(`Avatar uploadé et sauvé pour l'utilisateur ${userId}`);

        res.status(200).json({
            success: true,
            message: 'Avatar uploadé avec succès',
            data: {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                user: updatedUser
            }
        });

    } catch (error) {
        logger.error('Erreur upload avatar immédiat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'avatar',
            error: error.message
        });
    }
};

// Fonction utilitaire pour extraire le public_id d'une URL Cloudinary
function extractPublicIdFromUrl(url) {
    try {
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
        const match = url.match(/\/upload\/v\d+\/(.+?)(?:\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch (error) {
        logger.warn(`Impossible d'extraire le public_id de l'URL: ${url}`);
        return null;
    }
}

// Upload immédiat d'image de session
export const uploadSessionImageImmediate = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Vérifier que la session existe
        const Session = (await import('../session/session.model.js')).default;
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session non trouvée'
            });
        }

        // Supprimer l'ancienne image si elle existe
        if (session.image && session.image.includes('cloudinary.com')) {
            try {
                const publicId = extractPublicIdFromUrl(session.image);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.warn(`Impossible de supprimer l'ancienne image de session: ${error.message}`);
            }
        }

        // Upload vers Cloudinary
        const publicId = `session/${sessionId}/banner`;
        const uploadResult = await uploadToCloudinary(req.file, {
            folder: 'invoke',
            public_id: publicId,
            transformation: {
                quality: 'auto',
                fetch_format: 'auto'
            }
        });

        // Sauvegarder immédiatement l'URL en base
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            { image: uploadResult.secure_url },
            { new: true }
        );

        logger.info(`Image de session uploadée et sauvée pour la session ${sessionId}`);

        res.status(200).json({
            success: true,
            message: 'Image de session uploadée avec succès',
            data: {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                session: updatedSession
            }
        });

    } catch (error) {
        logger.error('Erreur upload image de session immédiat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image de session',
            error: error.message
        });
    }
};

// Upload immédiat d'image de campagne
export const uploadCampaignImageImmediate = async (req, res) => {
    try {
        const { campaignId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Vérifier que la campagne existe
        const Campaign = (await import('../campaign/campaign.model.js')).default;
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campagne non trouvée'
            });
        }

        // Supprimer l'ancienne image si elle existe
        if (campaign.image && campaign.image.includes('cloudinary.com')) {
            try {
                const publicId = extractPublicIdFromUrl(campaign.image);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.warn(`Impossible de supprimer l'ancienne image de campagne: ${error.message}`);
            }
        }

        // Upload vers Cloudinary
        const publicId = `campaign/${campaignId}/banner`;
        const uploadResult = await uploadToCloudinary(req.file, {
            folder: 'invoke',
            public_id: publicId,
            transformation: {
                quality: 'auto',
                fetch_format: 'auto'
            }
        });

        // Sauvegarder immédiatement l'URL en base
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { image: uploadResult.secure_url },
            { new: true }
        );

        logger.info(`Image de campagne uploadée et sauvée pour la campagne ${campaignId}`);

        res.status(200).json({
            success: true,
            message: 'Image de campagne uploadée avec succès',
            data: {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                campaign: updatedCampaign
            }
        });

    } catch (error) {
        logger.error('Erreur upload image de campagne immédiat:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image de campagne',
            error: error.message
        });
    }
};

// Suppression d'image
export const deleteImageImmediate = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        await deleteFromCloudinary(publicId);
        
        res.status(200).json({
            success: true,
            message: 'Image supprimée avec succès'
        });

    } catch (error) {
        logger.error('Erreur suppression image:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image',
            error: error.message
        });
    }
};
