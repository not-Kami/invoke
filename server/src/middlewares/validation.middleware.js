const validateGameImages = (req, res, next) => {
    const errors = [];

    // Vérification des champs requis
    if (!req.body.name) errors.push('Le nom du jeu est requis');
    if (!req.body.description) errors.push('La description est requise');
    if (!req.body.genre) errors.push('Le genre est requis');
    if (!req.body.system) errors.push('Le système est requis');

    // Vérification des images
    if (!req.files?.logo?.[0]) {
        errors.push('Un logo est requis');
    }

    if (!req.files?.banner?.[0]) {
        errors.push('Une bannière est requise');
    }

    if (!req.files?.images?.length) {
        errors.push('Au moins une image est requise');
    } else if (req.files.images.length > 10) {
        errors.push('Maximum 10 images sont autorisées');
    }

    // Vérification des captions
    if (req.body.captions) {
        const captions = JSON.parse(req.body.captions);
        const imageFiles = req.files?.images || [];
        
        // Vérifier que chaque image a un caption
        imageFiles.forEach(file => {
            if (!captions[file.originalname]) {
                errors.push(`Un caption est requis pour l'image ${file.originalname}`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errors
        });
    }

    next();
};

export { validateGameImages }; 