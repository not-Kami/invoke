import express from 'express';
import { 
    userAvatarUpload, 
    sessionBannerUpload, 
    campaignBannerUpload, 
    gameImageUpload,
    handleUploadError 
} from '../../middlewares/upload.middleware.js';
import {
    uploadUserAvatar,
    uploadSessionBanner,
    uploadCampaignBanner,
    uploadGameImage,
    deleteImage,
    getImageInfo,
    listImages
} from './upload.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// 🔒 PROTECTION GLOBALE - Toutes les routes d'upload nécessitent une authentification
router.use(protect);

// Routes pour les avatars utilisateur
router.post('/user/:id/avatar', userAvatarUpload, uploadUserAvatar);
router.post('/user/avatar', userAvatarUpload, uploadUserAvatar);

// Routes pour les bannières de session
router.post('/session/:id/banner', sessionBannerUpload, uploadSessionBanner);
router.post('/session/banner', sessionBannerUpload, uploadSessionBanner);

// Routes pour les bannières de campagne
router.post('/campaign/:id/banner', campaignBannerUpload, uploadCampaignBanner);
router.post('/campaign/banner', campaignBannerUpload, uploadCampaignBanner);

// Routes pour les images de jeu
// IMPORTANT: Route avec ID en premier pour éviter les conflits
router.post('/game/id/:gameId/:imageType', gameImageUpload, uploadGameImage);
router.post('/game/:gameName/:imageType', gameImageUpload, uploadGameImage);
router.post('/game/image', gameImageUpload, uploadGameImage);

// Routes pour la gestion des images
router.get('/list/:type', listImages);
router.get('/:type/:id/:imageType?', getImageInfo);
router.delete('/:type/:id/:imageType?', deleteImage);

// Middleware de gestion des erreurs d'upload
router.use(handleUploadError);

export default router;
