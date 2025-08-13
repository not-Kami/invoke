import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from '../config/logger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des types de fichiers autorisés
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Fonction pour créer les dossiers s'ils n'existent pas
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configuration du stockage dynamique (ancien système)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Si la route concerne un personnage, stocke dans uploads/characters/
        if (req.baseUrl.includes('/characters')) {
            const characterId = req.params.id;
            const uploadPath = path.join(__dirname, '../../uploads/characters/', characterId);
            ensureDirectoryExists(uploadPath);
            cb(null, uploadPath);
        } else if (req.baseUrl.includes('/users') && req.params.id) {
            // Si c'est un avatar utilisateur, utiliser la nouvelle structure
            const userId = req.params.id;
            const uploadPath = path.join(__dirname, '../../uploads/user/', userId);
            ensureDirectoryExists(uploadPath);
            cb(null, uploadPath);
        } else {
            // Fallback vers l'ancien système
            cb(null, path.join(__dirname, '../../uploads/avatars/'));
        }
    },
    filename: function (req, file, cb) {
        // Utilise nickname si dispo, sinon prénom-nom, sinon userId ou characterId
        const user = req.user || {};
        let base = user.nickname || (user.firstName && user.lastName ? `${user.firstName}-${user.lastName}` : user._id || 'unknown');
        
        if (req.baseUrl.includes('/characters') && req.params.id) {
            base = `character-${req.params.id}`;
        } else if (req.baseUrl.includes('/users') && req.params.id) {
            // Pour les avatars utilisateur, utiliser le format standard
            base = 'avatar';
        }
        
        const uniqueSuffix = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    }
});

// Configuration du stockage pour les avatars utilisateur (nouveau système)
const userAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.id || req.body.userId;
        const uploadPath = `uploads/user/${userId}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.params.id || req.body.userId;
        const extension = path.extname(file.originalname);
        cb(null, `avatar${extension}`);
    }
});

// Configuration du stockage pour les bannières de session
const sessionBannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const sessionId = req.params.id || req.body.sessionId;
        const uploadPath = `uploads/session/${sessionId}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sessionId = req.params.id || req.body.sessionId;
        const extension = path.extname(file.originalname);
        cb(null, `banner${extension}`);
    }
});

// Configuration du stockage pour les bannières de campagne
const campaignBannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const campaignId = req.params.id || req.body.campaignId;
        const uploadPath = `uploads/campaign/${campaignId}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const campaignId = req.params.id || req.body.campaignId;
        const extension = path.extname(file.originalname);
        cb(null, `banner${extension}`);
    }
});

// Configuration du stockage pour les images de jeu
const gameImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const gameName = req.params.gameName || req.body.gameName;
        const imageType = req.body.imageType || 'logo'; // logo, banner, portrait
        const uploadPath = `uploads/game/${gameName}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const imageType = req.body.imageType || 'logo';
        const extension = path.extname(file.originalname);
        cb(null, `${imageType}${extension}`);
    }
});

// Ancien système d'upload (maintenu pour compatibilité)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 1
    }
});

export const uploadImage = upload.single('image');

export const uploadImages = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
}).array('images', 5);

// Nouveaux middlewares d'upload
export const userAvatarUpload = multer({
    storage: userAvatarStorage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`), false);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE
    }
}).single('avatar');

export const sessionBannerUpload = multer({
    storage: sessionBannerStorage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`), false);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE
    }
}).single('banner');

export const campaignBannerUpload = multer({
    storage: campaignBannerStorage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`), false);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE
    }
}).single('banner');

export const gameImageUpload = multer({
    storage: gameImageStorage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`), false);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE
    }
}).single('image');

// Middleware de gestion des erreurs d'upload (compatible avec l'ancien et le nouveau)
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        logger.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 5 files.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
        });
    }
    
    if (err.message.includes('Type de fichier non autorisé')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    if (err) {
        logger.error('Upload error:', err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Fonction utilitaire pour supprimer un fichier
export const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        return false;
    }
};

// Fonction utilitaire pour obtenir le chemin d'un fichier
export const getFilePath = (type, id, imageType = null) => {
    switch (type) {
        case 'user':
            return `uploads/user/${id}/avatar`;
        case 'session':
            return `uploads/session/${id}/banner`;
        case 'campaign':
            return `uploads/campaign/${id}/banner`;
        case 'game':
            return `uploads/game/${id}/${imageType}`;
        default:
            throw new Error('Type d\'upload non reconnu');
    }
};

export default upload; 