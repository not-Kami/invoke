import fs from 'fs';
import path from 'path';
import { deleteFile, getFilePath } from '../../middlewares/upload.middleware.js';

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

// Upload d'image de jeu
export const uploadGameImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Extraire les paramètres selon la route utilisée
        let gameId, gameName, imageType;
        
        // Route: /game/:gameName/:imageType
        if (req.params.gameName && req.params.imageType) {
            gameName = req.params.gameName;
            imageType = req.params.imageType;
        }
        // Route: /game/id/:gameId/:imageType
        else if (req.params.gameId && req.params.imageType) {
            gameId = req.params.gameId;
            imageType = req.params.imageType;
        }
        // Route: /game/image (avec body)
        else if (req.body.gameId || req.body.gameName) {
            gameId = req.body.gameId;
            gameName = req.body.gameName;
            imageType = req.body.imageType;
        }
        
        console.log('🔍 Paramètres extraits:', {
            params: req.params,
            body: req.body,
            gameId,
            gameName,
            imageType
        });
        
        if (!gameId && !gameName) {
            return res.status(400).json({
                success: false,
                message: 'ID ou nom du jeu requis'
            });
        }

        if (!imageType || !['logo', 'banner', 'portrait'].includes(imageType)) {
            return res.status(400).json({
                success: false,
                message: 'Type d\'image requis: logo, banner ou portrait'
            });
        }

        // Utiliser l'ID si disponible, sinon le nom
        const identifier = gameId || gameName;
        const isById = !!gameId;

        // Supprimer l'ancienne image du même type si elle existe
        const oldImagePath = getFilePath('game', identifier, imageType);
        const oldImageDir = path.dirname(oldImagePath);
        
        if (fs.existsSync(oldImageDir)) {
            const files = fs.readdirSync(oldImageDir);
            files.forEach(file => {
                if (file.startsWith(imageType)) {
                    const fileToDelete = path.join(oldImageDir, file);
                    try {
                        // Ne pas supprimer le fichier qui vient d'être uploadé
                        // Comparer les noms de fichiers sans le chemin absolu
                        const currentFileName = path.basename(req.file.path);
                        const fileToDeleteName = path.basename(fileToDelete);
                        
                        if (fileToDeleteName !== currentFileName) {
                            fs.unlinkSync(fileToDelete);
                            console.log('🗑️ Ancien fichier supprimé:', fileToDelete);
                        } else {
                            console.log('🛡️ Fichier actuel protégé:', currentFileName);
                        }
                    } catch (error) {
                        console.log('Erreur lors de la suppression:', error);
                    }
                }
            });
        }

        console.log('✅ Fichier uploadé avec succès');
        console.log('filename:', req.file.filename);
        console.log('path:', req.file.path);
        console.log('size:', req.file.size);
        console.log('mimetype:', req.file.mimetype);
        console.log('url finale:', `/uploads/game/${identifier}/${req.file.filename}`);
        
        // Vérifier que le fichier existe réellement
        const fileExists = fs.existsSync(req.file.path);
        console.log('🔍 Vérification du fichier:');
        console.log('📁 Chemin du fichier:', req.file.path);
        console.log('📄 Fichier existe:', fileExists);
        console.log('📊 Taille du fichier:', req.file.size);
        
        if (fileExists) {
            const stats = fs.statSync(req.file.path);
            console.log('📈 Stats du fichier:', stats);
        }
        
        // Mettre à jour le jeu dans la base de données avec l'URL de l'image
        try {
            const Game = (await import('../../resources/game/game.model.js')).default;
            
            // Construire l'URL de l'image selon le type d'identifiant
            const isGameId = /^[0-9a-fA-F]{24}$/.test(identifier);
            const folderName = isGameId ? `id_${identifier}` : identifier;
            const imageUrl = `/uploads/game/${folderName}/${req.file.filename}`;
            
            console.log('🔗 Construction de l\'URL:', {
                identifier,
                isGameId,
                folderName,
                imageUrl
            });
            
            console.log('🔧 Debug mise à jour:', {
                gameId,
                gameName,
                identifier,
                imageType,
                imageUrl
            });
            
            // Mettre à jour le jeu avec l'URL de l'image
            // Utiliser l'ID si disponible, sinon chercher par nom
            let updateResult;
            if (gameId) {
                console.log('🆔 Mise à jour par ID:', gameId);
                // Mise à jour par ID
                updateResult = await Game.findByIdAndUpdate(
                    gameId,
                    { 
                        $set: { 
                            [`images.${imageType}`]: imageUrl 
                        } 
                    },
                    { new: true }
                );
            } else if (gameName) {
                console.log('📝 Mise à jour par nom:', gameName);
                
                // D'abord, chercher le jeu pour vérifier son nom exact
                const existingGame = await Game.findOne({ name: { $regex: new RegExp(gameName, 'i') } });
                if (existingGame) {
                    console.log('🔍 Jeu trouvé:', {
                        id: existingGame._id,
                        name: existingGame.name,
                        exactMatch: existingGame.name === gameName
                    });
                } else {
                    console.log('❌ Aucun jeu trouvé avec le nom:', gameName);
                    // Lister tous les jeux pour debug
                    const allGames = await Game.find({}, 'name');
                    console.log('📋 Tous les jeux en base:', allGames.map(g => g.name));
                }
                
                // Mise à jour par nom (insensible à la casse)
                updateResult = await Game.findOneAndUpdate(
                    { name: { $regex: new RegExp(gameName, 'i') } },
                    { 
                        $set: { 
                            [`images.${imageType}`]: imageUrl 
                        } 
                    },
                    { new: true }
                );
            } else {
                console.log('❌ Ni gameId ni gameName disponible');
            }
            
            if (updateResult) {
                console.log('✅ Jeu mis à jour avec l\'image:', imageUrl);
                console.log('📝 Jeu mis à jour:', updateResult.name);
                console.log('🆔 ID du jeu mis à jour:', updateResult._id);
            } else {
                console.log('⚠️ Jeu non trouvé pour la mise à jour');
                console.log('🔍 Recherche avec:', { gameId, gameName, identifier });
            }
        } catch (updateError) {
            console.error('❌ Erreur lors de la mise à jour du jeu:', updateError);
            console.error('🔍 Détails de l\'erreur:', {
                message: updateError.message,
                stack: updateError.stack
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Image ${imageType} du jeu uploadée avec succès`,
            data: {
                gameId,
                gameName,
                imageType,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/game/${identifier}/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error('Erreur upload image jeu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image du jeu'
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
