import { v2 as cloudinary } from 'cloudinary';
import env from './dotenv.config.js';
import logger from './logger.config.js';

// Configuration Cloudinary
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true // Utilise HTTPS
});

// Fonction pour uploader une image vers Cloudinary
export const uploadToCloudinary = async (file, options = {}) => {
    try {
        const {
            folder = 'invoke',
            public_id = null,
            transformation = {},
            resource_type = 'image'
        } = options;

        const uploadOptions = {
            folder,
            resource_type,
            ...transformation
        };

        if (public_id) {
            uploadOptions.public_id = public_id;
        }

        // Si c'est un buffer (depuis multer.memoryStorage)
        if (file.buffer) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                uploadOptions
            );
            return result;
        }

        // Si c'est un chemin de fichier (fallback)
        if (file.path) {
            const result = await cloudinary.uploader.upload(file.path, uploadOptions);
            return result;
        }

        throw new Error('Format de fichier non supporté pour Cloudinary');

    } catch (error) {
        logger.error('Erreur upload Cloudinary:', error);
        throw error;
    }
};

// Fonction pour supprimer une image de Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        logger.error('Erreur suppression Cloudinary:', error);
        throw error;
    }
};

// Fonction pour obtenir l'URL d'une image
export const getCloudinaryUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, options);
};

// Fonction pour générer un public_id fixe basé sur le type et l'ID
export const generatePublicId = (type, id, imageType = null) => {
    if (imageType) {
        return `${type}/${id}/${imageType}`;
    }
    return `${type}/${id}`;
};

export default cloudinary;
