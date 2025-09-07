import express from 'express';
import { 
    userAvatarUpload, 
    sessionBannerUpload, 
    campaignBannerUpload, 
    gameImageUpload,
    userAvatarUploadCloudinary,
    sessionBannerUploadCloudinary,
    campaignBannerUploadCloudinary,
    gameImageUploadCloudinary,
    uploadToCloudinaryMiddleware,
    handleUploadError 
} from '../../middlewares/upload.middleware.js';
import {
    uploadUserAvatar,
    uploadSessionBanner,
    uploadCampaignBanner,
    uploadGameImage,
    uploadUserAvatarCloudinary,
    uploadSessionBannerCloudinary,
    uploadCampaignBannerCloudinary,
    uploadGameImageCloudinary,
    deleteImage,
    deleteImageCloudinary,
    getImageInfo,
    listImages
} from './upload.controller.js';

const router = express.Router();

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
router.post('/game/:gameId/:imageType', gameImageUpload, uploadGameImage);
router.post('/game/name/:gameName/:imageType', gameImageUpload, uploadGameImage);
router.post('/game/image', gameImageUpload, uploadGameImage);

// Routes pour la gestion des images
router.get('/list/:type', listImages);
router.get('/:type/:id/:imageType?', getImageInfo);
router.delete('/:type/:id/:imageType?', deleteImage);

// ===== ROUTES CLOUDINARY =====

// Routes Cloudinary pour les avatars utilisateur
router.post('/cloudinary/user/:id/avatar', userAvatarUploadCloudinary, uploadToCloudinaryMiddleware, uploadUserAvatarCloudinary);
router.post('/cloudinary/user/avatar', userAvatarUploadCloudinary, uploadToCloudinaryMiddleware, uploadUserAvatarCloudinary);

// Routes Cloudinary pour les bannières de session
router.post('/cloudinary/session/:id/banner', sessionBannerUploadCloudinary, uploadToCloudinaryMiddleware, uploadSessionBannerCloudinary);
router.post('/cloudinary/session/banner', sessionBannerUploadCloudinary, uploadToCloudinaryMiddleware, uploadSessionBannerCloudinary);

// Routes Cloudinary pour les bannières de campagne
router.post('/cloudinary/campaign/:id/banner', campaignBannerUploadCloudinary, uploadToCloudinaryMiddleware, uploadCampaignBannerCloudinary);
router.post('/cloudinary/campaign/banner', campaignBannerUploadCloudinary, uploadToCloudinaryMiddleware, uploadCampaignBannerCloudinary);

// Routes Cloudinary pour les images de jeu
router.post('/cloudinary/game/:gameId/:imageType', gameImageUploadCloudinary, uploadToCloudinaryMiddleware, uploadGameImageCloudinary);
router.post('/cloudinary/game/name/:gameName/:imageType', gameImageUploadCloudinary, uploadToCloudinaryMiddleware, uploadGameImageCloudinary);
router.post('/cloudinary/game/image', gameImageUploadCloudinary, uploadToCloudinaryMiddleware, uploadGameImageCloudinary);

// Route pour supprimer une image Cloudinary
router.delete('/cloudinary/:publicId', deleteImageCloudinary);

// Middleware de gestion des erreurs d'upload
router.use(handleUploadError);

export default router;
