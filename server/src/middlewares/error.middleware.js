const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Gestion des erreurs spécifiques à multer
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Le fichier est trop volumineux. La taille maximale autorisée est de 5MB.'
        });
    }

    if (err.message && err.message.includes('Type de fichier non supporté')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Erreur générale
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors du traitement de votre requête.'
    });
};

export default errorHandler;