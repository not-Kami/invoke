import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du stockage dynamique
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Si la route concerne un personnage, stocke dans uploads/characters/
        if (req.baseUrl.includes('/characters')) {
            cb(null, path.join(__dirname, '../../uploads/characters/'));
        } else {
            cb(null, path.join(__dirname, '../../uploads/avatars/'));
        }
    },
    filename: function (req, file, cb) {
        // Utilise nickname si dispo, sinon prénom-nom, sinon userId ou characterId
        const user = req.user || {};
        let base = user.nickname || (user.firstName && user.lastName ? `${user.firstName}-${user.lastName}` : user._id || 'unknown');
        if (req.baseUrl.includes('/characters') && req.params.id) {
            base = `character-${req.params.id}`;
        }
        const uniqueSuffix = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    }
});

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
    if (err) {
        logger.error('Upload error:', err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

export default upload; 