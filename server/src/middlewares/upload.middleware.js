import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de multer pour le stockage en mémoire
const storage = multer.memoryStorage();

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB max par défaut

    // Vérification du type de fichier
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Type de fichier non supporté. Seules les images JPEG, JPG, PNG et WebP sont acceptées.'), false);
    }

    // Vérification de la taille du fichier
    if (file.size > maxFileSize) {
        return cb(new Error(`Le fichier est trop volumineux. La taille maximale autorisée est de ${maxFileSize / (1024 * 1024)}MB.`), false);
    }

    // Vérification des dimensions de l'image
    sharp(file.buffer)
        .metadata()
        .then(metadata => {
            // Vérification du ratio d'aspect pour le logo (1:1)
            if (file.fieldname === 'logo' && metadata.width !== metadata.height) {
                return cb(new Error('Le logo doit être carré (ratio 1:1)'), false);
            }

            // Vérification du ratio d'aspect pour la bannière (16:9)
            if (file.fieldname === 'banner' && Math.abs((metadata.width / metadata.height) - (16/9)) > 0.1) {
                return cb(new Error('La bannière doit avoir un ratio de 16:9'), false);
            }

            cb(null, true);
        })
        .catch(err => {
            cb(new Error('Impossible de lire les métadonnées de l\'image'), false);
        });
};

// Configurations spécifiques pour chaque type d'image
const imageConfigs = {
    user: {
        maxSize: 2 * 1024 * 1024, // 2MB
        maxWidth: 400,
        maxHeight: 400,
        quality: 80,
        aspectRatio: 1 // 1:1
    },
    game: {
        maxSize: 5 * 1024 * 1024, // 5MB
        maxWidth: 800,
        maxHeight: 800,
        quality: 80,
        aspectRatio: null // Pas de ratio spécifique
    },
    campaign: {
        maxSize: 5 * 1024 * 1024, // 5MB
        maxWidth: 1200,
        maxHeight: 800,
        quality: 85,
        aspectRatio: 1.5 // 3:2
    },
    session: {
        maxSize: 3 * 1024 * 1024, // 3MB
        maxWidth: 600,
        maxHeight: 600,
        quality: 80,
        aspectRatio: 1 // 1:1
    }
};

// Création des middlewares d'upload pour chaque type
const uploads = {};
Object.keys(imageConfigs).forEach(type => {
    uploads[type] = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: imageConfigs[type].maxSize
        }
    });
});

// Middleware pour compresser l'image selon le type
const compressImage = (type) => async (req, res, next) => {
    if (!req.file && !req.files) {
        return next();
    }

    try {
        const config = imageConfigs[type];
        const processImage = async (file) => {
            let sharpInstance = sharp(file.buffer);

            // Redimensionnement avec respect du ratio d'aspect
            if (config.aspectRatio) {
                sharpInstance = sharpInstance.resize({
                    width: config.maxWidth,
                    height: Math.round(config.maxWidth / config.aspectRatio),
                    fit: 'cover',
                    position: 'center'
                });
            } else {
                sharpInstance = sharpInstance.resize(config.maxWidth, config.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }

            // Compression
            return await sharpInstance
                .jpeg({ quality: config.quality })
                .toBuffer();
        };

        // Traitement des fichiers uniques
        if (req.file) {
            req.file.buffer = await processImage(req.file);
        }

        // Traitement des fichiers multiples
        if (req.files) {
            for (const field in req.files) {
                for (const file of req.files[field]) {
                    file.buffer = await processImage(file);
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

export { uploads, compressImage };
