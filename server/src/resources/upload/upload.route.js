import express from 'express';
import { 
    gameImageUpload, 
    userAvatarUpload,
    sessionImageUploadCloudinary,
    campaignImageUploadCloudinary
} from '../../middlewares/upload.middleware.js';
import { 
    uploadGameImageImmediate,
    uploadUserAvatarImmediate,
    uploadSessionImageImmediate,
    uploadCampaignImageImmediate,
    deleteImageImmediate
} from './upload.controller.js';

const router = express.Router();

// ===== ROUTES UPLOAD IMMÉDIAT =====

// Upload immédiat d'image de jeu
router.post('/immediate/game/:gameId/:imageType', 
    gameImageUpload, 
    uploadGameImageImmediate
);

// Upload immédiat d'avatar utilisateur
router.post('/immediate/user/:userId/avatar', 
    userAvatarUpload, 
    uploadUserAvatarImmediate
);

// Upload immédiat d'image de session
router.post('/immediate/session/:sessionId/banner', 
    sessionImageUploadCloudinary, 
    uploadSessionImageImmediate
);

// Upload immédiat d'image de campagne
router.post('/immediate/campaign/:campaignId/banner', 
    campaignImageUploadCloudinary, 
    uploadCampaignImageImmediate
);

// Suppression d'image
router.delete('/immediate/:publicId', deleteImageImmediate);

export default router;
