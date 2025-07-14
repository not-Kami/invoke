import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types de fichiers autorisés
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
];

const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

// Fonction de validation des types de fichiers
const createFileFilter = (allowedTypes, customMessage = null) => {
    return (req, file, cb) => {
        // Vérifier le type MIME
        if (allowedTypes.includes(file.mimetype)) {
            // Vérifier l'extension du fichier
            const ext = path.extname(file.originalname).toLowerCase();
            const allowedExtensions = {
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/jpg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'image/gif': ['.gif'],
                'image/webp': ['.webp'],
                'image/svg+xml': ['.svg'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'text/plain': ['.txt']
            };
            
            const expectedExtensions = allowedExtensions[file.mimetype] || [];
            if (expectedExtensions.length === 0 || expectedExtensions.includes(ext)) {
                logger.info(`File upload accepted: ${file.originalname} (${file.mimetype})`);
                cb(null, true);
            } else {
                const error = new Error(`File extension mismatch. Expected: ${expectedExtensions.join(', ')} for ${file.mimetype}`);
                logger.warn(`File upload rejected - extension mismatch: ${file.originalname} (${file.mimetype})`);
                cb(error, false);
            }
        } else {
            const error = new Error(customMessage || `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
            logger.warn(`File upload rejected - invalid type: ${file.originalname} (${file.mimetype})`);
            cb(error, false);
        }
    };
};

// Filtres prédéfinis
const imageFileFilter = createFileFilter(ALLOWED_IMAGE_TYPES, 'Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed!');
const documentFileFilter = createFileFilter(ALLOWED_DOCUMENT_TYPES, 'Only document files (PDF, DOC, DOCX, TXT) are allowed!');

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

// Configuration de base pour les images
const createImageUpload = (maxFiles = 1, maxSize = 5 * 1024 * 1024) => {
    return multer({
        storage: storage,
        fileFilter: imageFileFilter,
        limits: {
            fileSize: maxSize,
            files: maxFiles
        }
    });
};

// Configuration pour les documents
const createDocumentUpload = (maxFiles = 1, maxSize = 10 * 1024 * 1024) => {
    return multer({
        storage: storage,
        fileFilter: documentFileFilter,
        limits: {
            fileSize: maxSize,
            files: maxFiles
        }
    });
};

// Export des configurations prêtes à l'emploi
export const uploadImage = createImageUpload(1, 5 * 1024 * 1024).single('image');
export const uploadImages = createImageUpload(5, 5 * 1024 * 1024).array('images', 5);
export const uploadDocument = createDocumentUpload(1, 10 * 1024 * 1024).single('document');
export const uploadDocuments = createDocumentUpload(5, 10 * 1024 * 1024).array('documents', 5);

// Fonction pour créer un upload personnalisé
export const createCustomUpload = (allowedTypes, maxFiles = 1, maxSize = 5 * 1024 * 1024, fieldName = 'file') => {
    const customFilter = createFileFilter(allowedTypes);
    const customUpload = multer({
        storage: storage,
        fileFilter: customFilter,
        limits: {
            fileSize: maxSize,
            files: maxFiles
        }
    });
    
    return maxFiles === 1 ? customUpload.single(fieldName) : customUpload.array(fieldName, maxFiles);
};

export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        logger.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB for images, 10MB for documents.'
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

// Export des types autorisés pour référence
export { ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES };

export default uploadImage; 